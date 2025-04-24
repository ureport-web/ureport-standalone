express = require('express')
router = express.Router()
moment = require('moment');

Build = require('../../models/build')
Test = require('../../models/test')
InvestigatedTest = require('../../models/investigated_test')
TestRelation = require('../../models/test_relation')
Dashboard = require('../../models/dashboard')
Setting = require('../../models/setting')

ObjectId = require('mongoose').Types.ObjectId;
getSystemSetting = require('../../utils/getSystemSetting')

async = require("async")

router.post '/build/filter',  (req, res, next) ->
  if(!req.body.product)
    res.status(400)
    return res.json {error: "Product is mandatory"}

  if(!req.body.type)
    res.status(400)
    return res.json {error: "Type is mandatory"}

  isArchive = req.body.is_archive || false
  range = req.body.range || 5

  conditions = [is_archive : isArchive]
  conditions.push({ $or : req.body.product })
  conditions.push({ $or : req.body.type })

  # since = moment("2010-01-01").format()
  if(req.body.since)
    since = moment(req.body.since).format()  
    conditions.push({ start_time: { $gte: since }})

  if(req.body.after)
    after = moment(req.body.after).format()  
    conditions.push({ start_time: { $lte: after }})

  if(req.body.version)
    conditions.push({ $or : req.body.version })

  if(req.body.team)
    conditions.push({ $or : req.body.team })

  if(req.body.browser)
    conditions.push({ $or : req.body.browser })

  if(req.body.device)
    conditions.push({ $or : req.body.device })
  
  if(req.body.platform)
    conditions.push({ $or : req.body.platform })
  
  if(req.body.platform_version)
    conditions.push({ $or : req.body.platform_version })

  if(req.body.stage)
    conditions.push({ $or : req.body.stage })

  query = {
      $and : conditions
  }

  Build.find(query).
  sort({"start_time": -1}).
  limit(range).
  exec((err, builds) ->
    if(err)
      next err
    res.json builds
  );

router.post '/build/search', (req, res, next) ->
  if(!req.body.specificQueries)
    if(!req.body.product)
      res.status(400)
      return res.json {error: "Product is mandatory"}

    if(!req.body.type)
      res.status(400)
      return res.json {error: "Type is mandatory"}

  since = 90
  if(req.body.since)
    since = req.body.since

  range = -20
  if(req.body.range)
    range = (-req.body.range)

  query = {}

  if(req.body.specificQueries)
    query = { $or : req.body.specificQueries }
  else
    conditions = [
      { product: { $regex: req.body.product, $options: 'i'} },
      { type: { $regex: req.body.type, $options: 'i'} },
      { start_time: { $gte: new Date(moment().subtract(since,'day').format()) } }
    ]
    
    if(req.body.version)
      conditions.push({ version: { $regex: req.body.version, $options: 'i'} })

    if(req.body.team)
      conditions.push({ team: { $regex: req.body.team, $options: 'i'} })

    if(req.body.browser)
      conditions.push({ browser: { $regex: req.body.browser, $options: 'i'} })

    if(req.body.device)
      conditions.push({ device: { $regex: req.body.device, $options: 'i'} })
    
    if(req.body.platform)
      conditions.push({ platform: { $regex: req.body.platform, $options: 'i'} })
    
    if(req.body.platform_version)
      conditions.push({ platform_version: { $regex: req.body.platform_version, $options: 'i'} })

    if(req.body.stage)
      conditions.push({ stage: { $regex: req.body.stage, $options: 'i'} })

    query = { $and : conditions }

  Build.aggregate()
  .sort({start_time:1})
  .match(query)
  .group(
    { 
      # _id:  "$_id",
      _id:  {
        product:  "$product",
        type: "$type",
        version: "$version",
        team: "$team",
        browser: "$browser",
        device: "$device",
        platform: "$platform",
        platform_version: "$platform_version",
        stage: "$stage"
      },
      product: { $last: "$product"},
      type: { $last: "$type"},
      version: { $last: "$version"},
      team: { $last: "$team"},
      browser: { $last: "$browser"},
      device: { $last: "$device"},
      platform: { $last: "$platform"},
      platform_version: { $last: "$platform_version"},
      stage: { $last: "$stage"},
      build: { $last: "$build"},
      start_time: { $last: "$start_time"},
      environments: {$last: "$environments"},
      settings: {$last: "$settings"},
      aggregate_last_id: {
        $last : "$_id"
      },
      aggregate_last_start_time: {
        $last: "$start_time"
      },
      status: { 
        $last: "$status"
      },
      aggregate_previous_runs: { 
        $push: { 
          _id: "$_id",
          build: "$build",
          start_time: "$start_time",
          status: "$status"
        }
      }
  })
  .project(
    { 
      _id: "$_id",
      product: "$product",
      type: "$type",
      version: "$version",
      browser: "$browser",
      device: "$device",
      team: "$team",
      platform: "$platform",
      platform_version: "$platform_version",
      stage: "$stage",
      build: "$build",
      start_time: "$start_time",
      aggregate_last_id: "$aggregate_last_id",
      aggregate_last_start_time: "$aggregate_last_start_time",
      status: "$status",
      aggregate_previous_runs: { 
        $slice : ["$aggregate_previous_runs", range]
      },
      environments: "$environments",
      settings: "$settings"
  })
  .exec((err, builds) -> res.json builds );

router.get '/build/entity/producttype',  (req, res, next) ->
  entities = ['product','type']
  async.map(entities,
    (item, callback) ->
        Build.distinct(item).
        exec((err, entity) ->
            _t = {}
            _t[item] = entity
            callback(err,_t)
        )
    (err,rs) ->
        if err
          return next(err) 
        res.json rs
  )

router.post '/investigated_test/filter',  (req, res, next) ->
    if(!req.body.product)
        res.status(400)
        return res.json {error: "Product is mandatory"}

    if(!req.body.type)
        res.status(400)
        return res.json {error: "Type is mandatory"}
    
    getSystemSetting(req, "SYSTEM_SETTING", false, (setting) ->
        sinceDay = 30

        if(setting && setting.analysisSinceDay)
            sinceDay = setting.analysisSinceDay

        if(req.body.fromDate)
            fromDate = req.body.fromDate
        else
            fromDate = moment().subtract(sinceDay,'day').format()

        #build exclude doc
        if(req.body.exclude)
            exclude = {}
            InvestigatedTest.buildExcludeFieldQuery(exclude,req.body.exclude)

        query = {
            product: req.body.product
            type: req.body.type
            create_at: { $gte: fromDate }
        }
        # invTest filter and condition
        InvestigatedTest.find(query,exclude)
        .exec((err, invTests) ->
            if err
                return next(err)
            else
                res.json invTests
        )
    )

router.post '/test_relation/filter',  (req, res, next) ->
    if(!req.body.product)
        res.status(400)
        return res.json {error: "Product is mandatory"}

    if(!req.body.type)
        res.status(400)
        return res.json {error: "Type is mandatory"}

    query = {
      product: req.body.product
      type: req.body.type
    }

    #build exclude doc
    if(req.body.exclude)
        exclude = {}
        TestRelation.buildExcludeFieldQuery(exclude,req.body.exclude)

    TestRelation.find(query,exclude).
    exec((err, tests) ->
        if(err)
          next err
        res.json tests
    );

router.get '/dashboard/:id',  (req, res, next) ->
  Dashboard.findOne({_id: req.params.id}).
  exec((err, rs) ->
    if(err)
      return next(err)

    if(rs)
      res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Dashboard with id " + req.params.id}
  );

router.post '/test/filter',  (req, res, next) ->
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
    .exec((err, tests) ->
        if(err)
            next err
        res.json tests
    );

router.post '/test/filter/nonpass',  (req, res, next) ->
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
    conditions = [{ $or: [{is_rerun:false},{is_rerun:null}] }]
    if(req.body.status)
        status = []
        Test.buildStatusQuery(status,req.body.status)
        conditions.push({ $or: status })
    
    query.$or = [
        { $and: conditions }, 
        { 
            $and: [{ $or: [{is_rerun:true}] }]
        }
    ]

    #build exclude doc
    if(req.body.exclude)
        exclude = {}
        Test.buildExcludeFieldQuery(exclude,req.body.exclude)

    Test.find(query,exclude)
    .sort({uid:1})
    .exec((err, tests) ->
        if(err)
            next err
        res.json tests
    );

router.post '/test/aggregate/stable', (req, res, next) -> 
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

router.post '/test/aggregate/unstable', (req, res, next) -> 
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

router.post '/setting/filter',  (req, res, next) ->
  if(!req.body.product)
    res.status(400)
    return res.json {error: "Product is mandatory"}

  if(!req.body.type)
    res.status(400)
    return res.json {error: "Type is mandatory"}
  conditions = []
  conditions.push({ product : req.body.product })
  conditions.push({ type : req.body.type })
  query = {
      $and : conditions
  }
  Setting.find(query).
  limit(1).
  exec((err, cases) ->
    if(err)
      return next(err)
    res.json cases
  );

router.post '/test/aggregate/trend', (req, res, next) -> 
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

module.exports = router
