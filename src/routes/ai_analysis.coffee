express = require('express')
crypto = require('crypto')
router = express.Router()

Test = require('../models/test')
Build = require('../models/build')
AiAnalysis = require('../models/ai_analysis')
InvestigatedTest = require('../models/investigated_test')
aiProviderFactory = require('../utils/ai_provider_factory')
aiService = require('../utils/ai_service')

deduplicateSiblings = (siblings) ->
  byUid = {}
  siblings.forEach((s) ->
    if not byUid[s.uid] or s.is_rerun
      byUid[s.uid] = s
  )
  return Object.keys(byUid).map((uid) -> byUid[uid])

insertSiblingRecords = (siblings, inputHash, result, provider, model, product, type) ->
  return if not siblings or not siblings.length
  AiAnalysis.find({ test_id: { $in: siblings.map((s) -> s._id) }, input_hash: inputHash })
  .select('test_id')
  .exec((err, existing) ->
    return if err
    existingSet = {}
    existing.forEach((e) -> existingSet[e.test_id.toString()] = true)
    toInsert = []
    siblings.forEach((s) ->
      if not existingSet[s._id.toString()]
        toInsert.push({
          test_id: s._id
          uid: s.uid
          product: product
          type: type
          input_hash: inputHash
          result: result
          provider: provider
          model: model
        })
    )
    return if not toInsert.length
    AiAnalysis.insertMany(toInsert, { ordered: false }, (err) ->
      if err then console.error('Failed to backfill sibling AI analyses:', err)
    )
  )

###
 * POST /api/ai/analyze-test/:testId
 * Run AI root cause analysis for a failing test
###
router.post '/analyze-test/:testId', (req, res, next) ->
  testId = req.params.testId

  Test.findById(testId).exec((err, test) ->
    if err
      return next(err)
    if not test
      return res.status(404).json({ error: 'Test not found' })

    Build.findById(test.build).select('product type').exec((err, build) ->
      if err
        return next(err)
      if not build
        return res.status(404).json({ error: 'Build not found for test' })

      product = build.product
      type = build.type

      aiProviderFactory.getProvider((err, provider, providerName, modelName) ->
        if err
          return next(err)
        if not provider
          return res.status(503).json({ error: 'AI not configured', configured: false })

        # Build input hash for caching
        errorMsg = (test.failure and test.failure.error_message) or ''
        stackTrace = (test.failure and test.failure.stack_trace) or ''
        inputHash = crypto.createHash('sha1').update(errorMsg + stackTrace).digest('hex')

        # Check cache
        AiAnalysis.findOne({ input_hash: inputHash }).exec((err, cached) ->
          if err
            return next(err)
          if cached
            AiAnalysis.findOne({ test_id: test._id }).exec((err, existing) ->
              if not err and not existing
                newRecord = new AiAnalysis({
                  test_id: test._id
                  uid: test.uid
                  product: product
                  type: type
                  input_hash: inputHash
                  result: cached.result
                  provider: cached.provider
                  model: cached.model
                })
                newRecord.save((err) ->
                  if err then console.error('Failed to save AiAnalysis for cache-hit test_id:', err)
                )
              if not errorMsg
                return res.json({ result: cached.result, cached: true, provider: cached.provider, model: cached.model, siblingTestIds: [] })
              Test.find({
                build: test.build
                _id: { $ne: test._id }
                uid: { $ne: test.uid }
                'failure.error_message': errorMsg
                'failure.stack_trace': stackTrace
              })
              .select('_id uid is_rerun')
              .exec((err, siblings) ->
                deduped = if not err and siblings then deduplicateSiblings(siblings) else []
                siblingIds = deduped.map((s) -> s._id.toString())
                if deduped.length
                  insertSiblingRecords(deduped, inputHash, cached.result, cached.provider, cached.model, product, type)
                res.json({ result: cached.result, cached: true, provider: cached.provider, model: cached.model, siblingTestIds: siblingIds })
              )
            )
            return

          # Fetch recent run history (last 5 runs for same uid)
          Test.find({
            uid: test.uid
            build: { $ne: test.build }
          })
          .select('status failure start_time')
          .sort({ start_time: -1 })
          .limit(5)
          .exec((err, historyTests) ->
            if err
              historyTests = []

            # Fetch recent InvestigatedTest records for accuracy context
            InvestigatedTest.find({
              uid: test.uid
            })
            .select('caused_by')
            .sort({ create_at: -1 })
            .limit(3)
            .exec((err, investigations) ->
              if err
                investigations = []

              aiService.analyzeTestFailure(provider, test, historyTests, investigations, (err, result) ->
                if err
                  return next(err)

                record = new AiAnalysis({
                  test_id: test._id
                  uid: test.uid
                  product: product
                  type: type
                  input_hash: inputHash
                  result: result
                  provider: providerName
                  model: modelName
                })

                record.save((err, saved) ->
                  if err
                    # Don't fail if save fails — still return result
                    console.error('Failed to save AiAnalysis:', err)

                  if not errorMsg
                    return res.json({ result: result, cached: false, provider: providerName, model: modelName, siblingTestIds: [] })
                  Test.find({
                    build: test.build
                    _id: { $ne: test._id }
                    uid: { $ne: test.uid }
                    'failure.error_message': errorMsg
                    'failure.stack_trace': stackTrace
                  })
                  .select('_id uid is_rerun')
                  .exec((err, siblings) ->
                    deduped = if not err and siblings then deduplicateSiblings(siblings) else []
                    siblingIds = deduped.map((s) -> s._id.toString())
                    if deduped.length
                      insertSiblingRecords(deduped, inputHash, result, providerName, modelName, product, type)
                    res.json({ result: result, cached: false, provider: providerName, model: modelName, siblingTestIds: siblingIds })
                  )
                )
              )
            )
          )
        )
      )
    )
  )

###
 * PATCH /api/ai/analysis/feedback
 * Record human-confirmed cause_by for AI accuracy tracking
###
router.patch '/analysis/feedback', (req, res, next) ->
  { test_id, human_caused_by } = req.body
  if not test_id
    return res.status(400).json({ error: 'test_id is required' })

  AiAnalysis.findOneAndUpdate(
    { test_id: test_id }
    { human_caused_by: human_caused_by }
    { sort: { created_at: -1 }, new: true }
    (err, updated) ->
      if err
        return next(err)
      res.json({ ok: true, updated: !!updated })
  )

###
 * GET /api/ai/analyses
 * Bulk fetch all AI analysis records for a product/type
###
router.get '/analyses', (req, res, next) ->
  { product, type } = req.query
  if not product or not type
    return res.status(400).json({ error: 'product and type required' })
  AiAnalysis.find({ product: product, type: type })
  .select('test_id result provider model created_at')
  .sort({ created_at: -1 })
  .exec((err, records) ->
    if err then return next(err)
    res.json(records)
  )

###
 * GET /api/ai/ping
 * Check if AI is configured and reachable
###
router.get '/ping', (req, res, next) ->
  aiProviderFactory.getProvider((err, provider, providerName, model) ->
    if err
      return next(err)
    if not provider
      return res.json({ configured: false, provider: null })
    provider.chat('You are a test assistant.', 'Reply with only the word PONG.', (chatErr, reply) ->
      if chatErr
        return res.status(502).json({ configured: true, provider: providerName, error: chatErr.message or String(chatErr) })
      res.json({ configured: true, provider: providerName, model: model, reply: reply?.trim() })
    )
  )

module.exports = router
