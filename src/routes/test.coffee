express = require('express')
moment = require('moment')
router = express.Router()
crypto = require('crypto')
# file upload
multer  = require('multer')
storage = multer.diskStorage({
  destination: (req, file, cb) ->
    cb(null, 'dist/assets/images/uploads')
  filename: (req, file, cb) ->
    cb(null, crypto.randomBytes(16).toString('hex'))
})
upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } })

Test = require('../models/test')
getSystemSetting = require('../utils/getSystemSetting')

async = require("async")
ObjectId = require('mongoose').Types.ObjectId;
registerAudit = require('../utils/register_audit')
logger = require('../utils/logger')
cache = require('../lib/cache')

AccessControl = require('../utils/ac_grants')
component = 'test'
TEST_CACHE_TTL = 20 * 24 * 60 * 60  # 20 days — safe because writes invalidate cache

CACHE_PROJECTION = {setup: 0, body: 0, teardown: 0}

applyExclude = (tests, excludeMap) ->
    fields = Object.keys(excludeMap)
    return tests if fields.length == 0
    tests.map (t) ->
        obj = if t.toObject? then t.toObject() else Object.assign({}, t)
        delete obj[f] for f in fields
        obj

applyStatusFilter = (tests, statusParam) ->
    return tests unless statusParam
    statuses = if Array.isArray(statusParam) then statusParam else [statusParam]
    return tests if statuses.indexOf('All') != -1
    tests.filter (t) -> statuses.indexOf(t.status) != -1

router.get '/:id',  (req, res, next) ->
    Test.findOne({
      _id: new ObjectId(req.params.id)
    }).
    exec((err, test) ->
      res.json test
    );

router.post '/single', upload.single('image'), (req, res, next) ->
    if (!AccessControl.canAccessCreateAny(req.user.role,component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})
    if(req.file && req.file.mimetype)
        if req.file.mimetype in ['image/jpg', 'image/jpeg', 'image/png']
            try 
                res.status(200)
                res.json {msg:"success"}
            catch e
                res.json {error : e}
        else
            res.status(400)
            return res.json {error: "Sorry, We only support jpg or png format."}
    else
        res.status(400)
        return res.json {error: "Cannot find any attachment."}

#TODO: update to make changes for the rerun
router.post '/multi', (req, res, next) ->
    if (!AccessControl.canAccessCreateAny(req.user.role,component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    if(!req.body.tests)
        res.status(400)
        return res.json {error: "Please provide tests to save."}
    if(req.body.tests.length > 100)
        res.status(400)
        return res.json {error: "Due to performance reason, please only send 100 tests at a time."}
    
    isOrdered = true
    if(req.body.isOrdered != null && req.body.isOrdered != '' && typeof req.body.isOrdered == "boolean")
      isOrdered = req.body.isOrdered
    
    try 
      Test.insertMany(req.body.tests,{ ordered: isOrdered }, (err, tests) ->
        if(err)
            err.status = 500
            return next(err)
        state = "Success"
        if(req.body.tests.length != tests.length)
          state = "Partial Success, you might have missing fields in your paylaod, not all tests are saved."
        # Invalidate build cache so next read reflects newly saved tests
        cache.del "test:v2:#{req.body.tests[0].build}"
        res.json {
          state : state
          provided : req.body.tests.length
          saved : tests.length
        }
      );
    catch e
      res.json {error : e}

# TODO MISSING TEST
router.post '/status/:id',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
  Test.findOne({_id: req.params.id}).
  exec((err, test) ->
    if err
      next err

    if test
      Test.changeStatus(test, req.body)
      test.save (err, rs) ->
        if err
          next err
        if(req.body.status)
            req.body.uid = test.uid  # set for audit purpose
            registerAudit(req, res, "Change Status to " + req.body.status, "UPDATE")
        res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find test with id " + req.params.id}
  );

#  get history of a test based on UID
router.post '/history/:uid',  (req, res, next) ->
    limit = 5
    include=['start_time','end_time','status','failure','is_rerun','build']
    if(req.body.limit)
        limit = req.body.limit
    
    if(req.body.include && req.body.include instanceof Array)
        include = req.body.include
    else
        if(req.body.include.toLowerCase() == 'all')
            include = []
        else
            include = [req.body.include]

    Test.find({
        uid: req.params.uid,
        start_time: { $lte: req.body.before }
    }, include).
    sort({"start_time": -1}).
    limit(limit).
    lean().
    exec((err, test) ->
      res.json test
    );

router.post '/filter',  (req, res, next) ->
    if(!req.body.build)
        res.status(400)
        return res.json {error: "Build id is mandatory"}

    if( typeof req.body.build == 'string' )
        query = {
          build: new ObjectId(req.body.build)
        }
    else
        ins = []
        Test.buildBuildsQuery(ins,req.body.build)
        query = {
            build : {
                $in : ins
            }
        }
    # build filter and condition
    conditions = []
    if(req.body.status)
        status = []
        Test.buildStatusQuery(status,req.body.status)
        conditions.push({ $or: status })
    
    if(conditions.length>0)
        query.$and = conditions

    #build exclude doc
    if(req.body.exclude)
        exclude = {}
        Test.buildExcludeFieldQuery(exclude,req.body.exclude)

    Test.find(query,exclude)
    .sort({uid:1})
    .lean()
    .exec((err, tests) ->
        if(err)
            next err
        res.json tests
    );

router.post '/filter/all',  (req, res, next) ->
    startTime = Date.now()
    if(!req.body.build)
        res.status(400)
        return res.json {error: "Build id is mandatory"}

    # Get build IDs array
    buildIds = if typeof req.body.build == 'string' then [req.body.build] else req.body.build

    cacheStartTime = Date.now()

    # Check cache for all build IDs in parallel via async.map
    async.map buildIds, ((buildId, cb) -> cache.get "test:v2:#{buildId}", cb), (err, cacheResults) ->
        cacheTime = Date.now() - cacheStartTime

        cachedResults = []
        uncachedBuildIds = []

        for i in [0...buildIds.length]
            buildId = buildIds[i]
            cached = cacheResults[i]
            if cached != undefined && cached != null && cached.length > 0
                cachedResults = cachedResults.concat(cached)
            else
                uncachedBuildIds.push(buildId)

        logger.debug("Uncached build IDs:", uncachedBuildIds)

        # If all builds are cached, return immediately
        if uncachedBuildIds.length == 0
            totalTime = Date.now() - startTime
            logger.debug("All builds found in cache - Total response time: #{totalTime}ms")
            result = applyStatusFilter(cachedResults, req.body.status)
            if req.body.exclude
                excl = {}
                Test.buildExcludeFieldQuery(excl, req.body.exclude)
                result = applyExclude(result, excl)
            return res.json result

        # Query only uncached builds
        dbStartTime = Date.now()
        ins = []
        Test.buildBuildsQuery(ins, uncachedBuildIds)
        query = { build: { $in: ins } }

        # build filter and condition - no status condition
        conditions = [{ $or: [{is_rerun:false},{is_rerun:null}] }]

        query.$or = [
            { $and: conditions },
            {
                $and: [{ $or: [{is_rerun:true}] }]
            }
        ]

        Test.find(query, CACHE_PROJECTION)
        .sort({uid:1})
        .lean()
        .exec((err, tests) ->
            dbTime = Date.now() - dbStartTime
            logger.debug("DB query took #{dbTime}ms")
            if(err)
                return next err

            # Group tests by build and cache full docs at shared key test:#{buildId}
            testsByBuild = {}
            for test in tests
                buildId = test.build.toString()
                testsByBuild[buildId] ?= []
                testsByBuild[buildId].push(test)

            for buildId, buildTests of testsByBuild
                cache.set "test:v2:#{buildId}", buildTests, TEST_CACHE_TTL

            # Combine cached and new results, apply status filter + exclude in memory
            allResults = applyStatusFilter(cachedResults.concat(tests), req.body.status)
            if req.body.exclude
                excl = {}
                Test.buildExcludeFieldQuery(excl, req.body.exclude)
                allResults = applyExclude(allResults, excl)
            totalTime = Date.now() - startTime
            logger.debug("Total response time: #{totalTime}ms (Cache: #{cacheTime}ms, DB: #{dbTime}ms)")
            res.json allResults
        )

router.post '/find/test/:id',  (req, res, next) ->
    if (!AccessControl.canAccessCreateAny(req.user.role,component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})
    Test.findOne({_id: req.params.id}).
    exec((err, test) ->
        if err
            next err

        if test
            res.json test
        else
            res.status(404)
            res.json {"error": "Cannot find Test with id " + req.params.id}
    );

# this endpoint will only give back the trend for tests that either always pass or fail or skip
router.post '/aggregate/stable', (req, res, next) -> 
    if(req.body.builds)
        Test.aggregate()
        .match({ $and : [
            { build : {$in : req.body.builds.map((el) -> ObjectId(el) )} }, 
            { $or: [ { is_rerun: false }, { is_rerun: null} ]} 
            ]
        })
        .group({ _id: "$uid", total: { $sum: 1 }, status: { $push: "$status" }, trace: { $push: { $substr: ["$status", 0, 1] } } })
        .project({ 
            total : "$total", 
            trace : "$trace", 
            fails: { 
                $filter: { 
                    input: '$status', 
                    as: 's', 
                    cond: { $eq: ['$$s', 'FAIL'] } 
                } 
            },
            passes: { 
                $filter: { 
                    input: '$status', 
                    as: 's', 
                    cond: { $eq: ['$$s', 'PASS'] } 
                } 
            },
            skips: { 
                $filter: { 
                    input: '$status', 
                    as: 's', 
                    cond: { $eq: ['$$s', 'SKIP'] } 
                } 
            } 
        })
        .project({ 
            failNumber : { $size: "$fails" },
            passNumber : { $size: "$passes" },
            skipNumber : { $size: "$skips" },
            total: "$total",
            size : { $size:  "$trace" }
        })
        .project({ 
            percentage_f: { $divide: [ "$failNumber", "$total" ] }, 
            percentage_p: { $divide: [ "$passNumber", "$total" ] }, 
            percentage_s: { $divide: [ "$skipNumber", "$total" ] }, 
            size : "$size" 
        })
        .match({ 
            $or : [
                { percentage_f : { $eq : 1.0 } },
                { percentage_p : { $eq : 1.0 } },
                { percentage_s : { $eq : 1.0 } }
            ]
        })
        .exec((err, tests) -> res.json tests );
    else
        res.status(404)
        res.json {"error": "builds list is mandatory"}

router.post '/aggregate/unstable', (req, res, next) -> 
    if(req.body.builds)
        Test.aggregate()
        .match({
            $and : [
                { build : {$in : req.body.builds.map((el) -> ObjectId(el) )} },
                { $or: [ { is_rerun: false }, { is_rerun: null} ]} ]
        })
        .group({
            _id: "$uid",
            total: { $sum: 1 },
            status: { $push: "$status" },
            trace: { $push: { $substr: ["$status", 0, 1] } }
        })
        .project({
            total : "$total" ,
            trace : "$trace",
            fails: { 
                $filter: { 
                    input: '$status', 
                    as: 's', 
                    cond: { 
                        $or: [
                            {$eq: ['$$s', "FAIL"]},
                            {$eq: ['$$s', "SKIP"]}
                        ]
                    } 
                } 
            }
        })
        .project({
            failNumber : { $size: "$fails" },
            total: "$total" ,
            trace : "$trace"
        })
        .project({
            percentage: { $divide: [ "$failNumber", "$total" ] },
            trace : "$trace"
        })
        .match({
            $and: [
                { percentage : { $lt : 0.9 }},
                { percentage : { $gt : 0.0 }}
            ]
        })
        .sort({ percentage: -1 })
        .exec((err, tests) -> res.json tests );
    else
        res.status(404)
        res.json {"error": "builds list is mandatory"}

router.post '/aggregate/trend', (req, res, next) -> 
    if(req.body.builds) 
        Test.aggregate()
        .match({
            $and : [
                { build : {$in : req.body.builds.map((el) -> ObjectId(el) )} }
                # { $or: [ { is_rerun: false }, { is_rerun: null} ]} 
                ]
        })
        .group({
            _id: "$uid",
            trend: { $push: {
                    build: "$build", 
                    status : "$status",
                    start_time: "$start_time",
                    uid : "$uid",
                    id: "$_id",
                    failure: "$failure",
                    is_rerun: "$is_rerun"
                }
            }
        })
        .project({
            trend : "$trend"
        })
        .exec((err, tests) -> res.json tests );
    else
        res.status(404)
        res.json {"error": "builds list is mandatory"}

router.post '/aggregate/single/history', (req, res, next) -> 
    if(req.body.uid)
        Test.aggregate()
        .sort({ start_time : -1 })
        .match({ uid : req.body.uid })
        .lookup({
           from: "builds",
           localField: "build",
           foreignField: "_id",
           as: "build"
        })
        .unwind("$build")
        .project({
            uid: "$uid",
            x:"$newField"
            status: "$status",
            start_time : "$start_time" ,
            end_time : "$end_time" ,
            is_rerun: "$is_rerun",
            failure: "$failure",
            build: { 
                _id : "$build._id",
                product : "$build.product",
                type : "$build.type",
                team : "$build.team",
                browser : "$build.browser",
                device : "$build.device",
                version : "$build.version",
                platform : "$build.platform",
                platform_version : "$build.platform_version",
                stage : "$build.stage",
                build : "$build.build",
                status: "$build.status"
            }
        })
        .match({ build : { $exists: true, $ne: [] } })
        .limit(500)
        .exec((err, tests) -> res.json tests );
    else
        res.status(404)
        res.json {"error": "uid is mandatory"}

router.post '/aggregate/by/failure', (req, res, next) ->
    getSystemSetting(req, "SYSTEM_SETTING", false, (setting) ->
        # if(req.body.uid)
        sinceDay = 30

        if(setting && setting.analysisSinceDay)
            sinceDay = setting.analysisSinceDay

        if(req.body.since)
            since = req.body.since
        else
            since = moment().subtract(sinceDay,'day').format()

        condition = { 
            status:{$ne : "PASS"},
            start_time: { $gte: new Date(since) }
        }
        if(req.body.uid)
            condition["uid"] = req.body.uid
        if(req.body.token)
            condition["failure.token"] = req.body.token
        if(req.body.error_message)
            condition["failure.error_message"] = req.body.error_message
        if(req.body.stack_trace)
            condition["failure.stack_trace"] = req.body.stack_trace
        
        Test.aggregate()
        .sort({ start_time : -1 })
        .match(condition)
        .lookup({
            from: "builds",
            localField: "build",
            foreignField: "_id",
            as: "build"
        })
        .unwind("$build")
        .project({
            uid: "$uid",
            status: "$status",
            start_time : "$start_time" ,
            end_time : "$end_time" ,
            is_rerun: "$is_rerun",
            failure: "$failure",
            build: { 
                _id : "$build._id",
                product : "$build.product",
                type : "$build.type",
                team : "$build.team",
                browser : "$build.browser",
                device : "$build.device",
                version : "$build.version",
                platform : "$build.platform",
                platform_version : "$build.platform_version",
                stage : "$build.stage",
                build : "$build.build",
                status: "$build.status",
                start_time : "$start_time"
            }
        })
        .exec((err, tests) -> res.json tests );
    )
    # else
    #     res.status(404)
    #     res.json {"error": "uid is mandatory"}

router.post '/cache/refresh', (req, res, next) ->
  if !AccessControl.canAccessDeleteAny(req.user.role, component)
    return res.status(403).json({ error: "You don't have permission to perform this action" })

  buildIds = req.body.buildIds
  if !buildIds or !Array.isArray(buildIds) or buildIds.length == 0
    return res.status(400).json({ error: "buildIds array is required" })

  if buildIds.length > 50
    return res.status(400).json({ error: "Maximum 50 build IDs per request" })

  ins = []
  Test.buildBuildsQuery(ins, buildIds)
  query = { build: { $in: ins } }
  conditions = [{ $or: [{is_rerun: false}, {is_rerun: null}] }]
  query.$or = [
    { $and: conditions },
    { $and: [{ $or: [{is_rerun: true}] }] }
  ]

  Test.find(query, CACHE_PROJECTION)
  .sort({ uid: 1 })
  .lean()
  .exec((err, tests) ->
    if err
      return next(err)

    testsByBuild = {}
    for test in tests
      buildId = test.build.toString()
      testsByBuild[buildId] ?= []
      testsByBuild[buildId].push(test)

    for buildId, buildTests of testsByBuild
      cache.set "test:v2:#{buildId}", buildTests, TEST_CACHE_TTL

    results = buildIds.map (buildId) ->
      buildTests = testsByBuild[buildId] or []
      { buildId, status: 'ok', testCount: buildTests.length }

    res.json({ refreshed: buildIds.length, results })
  )

module.exports = router
