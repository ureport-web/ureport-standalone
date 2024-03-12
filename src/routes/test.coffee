express = require('express')
moment = require('moment')
router = express.Router()
# file upload
multer  = require('multer')
storage = multer.diskStorage({
  destination: (req, file, cb) ->
    cb(null, 'dist/assets/images/uploads')
  filename: (req, file, cb) ->
    cb(null, file.fieldname + '-' + Date.now())
})
upload = multer({ storage: storage })

Test = require('../models/test')
getSystemSetting = require('../utils/getSystemSetting')

async = require("async")
ObjectId = require('mongoose').Types.ObjectId;
registerAudit = require('../utils/register_audit')

AccessControl = require('../utils/ac_grants')
component = 'test'

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
        if(req.file.mimetype == 'image/jpg' || req.file.mimetype == 'image/png')
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
            return next(err)
        state = "Success"
        if(req.body.tests.length != tests.length)
          state = "Partial Success, you might have missing fields in your paylaod, not all tests are saved."
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
    if(req.body.limit)
        limit = req.body.limit

    Test.find({
        uid: req.params.uid,
        start_time: { $lte: req.body.before }
    }).
    sort({"start_time": -1}).
    limit(limit).
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
    .exec((err, tests) ->
        if(err)
            next err
        res.json tests
    );

router.post '/filter/nonpass',  (req, res, next) ->
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

router.post '/steps/:id',  (req, res, next) ->
  Test.findOne({_id: req.params.id}).
  exec((err, test) ->
    if err
      next err

    if test
      Test.addStep(test, req.body)
      test.save (err, results) ->
        if err
          next err
        res.json test
    else
      res.status(404)
      res.json {"error": "Cannot find Test with id " + req.params.id}
  );

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
                { $or: [ { is_rerun: false }, { is_rerun: null} ]} 
            ]
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

module.exports = router
