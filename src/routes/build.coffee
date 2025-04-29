express = require('express')
router = express.Router()
moment = require('moment');

Build = require('../models/build')
Test = require('../models/test')
ObjectId = require('mongoose').Types.ObjectId;
ISODate = require('mongoose').Types.ISODate;
async = require("async")

registerAudit = require('../utils/register_audit')
AccessControl = require('../utils/ac_grants')
component = 'build'

router.get '/:id',  (req, res, next) ->
  Build.findOne({_id: req.params.id}).
  exec((err, build) ->
    if(err)
      next err

    if(build)
      res.json build
    else
      res.status(404)
      res.json {"error": "Cannot find Build with id " + req.params.id}
  );

router.post '/',  (req, res, next) ->
  if (!AccessControl.canAccessCreateAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  if(!req.body.product)
    res.status(400)
    return res.json {error: "Product is mandatory"}

  if(!req.body.type)
    res.status(400)
    return res.json {error: "Type is mandatory"}
  
  if(!req.body.build)
    res.status(400)
    return res.json {error: "Build is mandatory"}

  isArchive = req.body.is_archive || false

  conditions = [ {build: req.body.build}, {is_archive : isArchive}]
  conditions.push({ $or : [{product: req.body.product}] })
  conditions.push({ $or : [{type: req.body.type}] })

  if(req.body.version)
    conditions.push({ $or : [{version:req.body.version}] })
  else
    conditions.push({ $or : [{version: null}] })

  if(req.body.team)
    conditions.push({ $or : [{team: req.body.team}] })
  else
    conditions.push({ $or : [{team: null}] })

  if(req.body.browser)
    conditions.push({ $or : [{browser: req.body.browser}] })
  else
    conditions.push({ $or : [{browser: null}] })

  if(req.body.device)
    conditions.push({ $or : [{device: req.body.device}] })
  else
    conditions.push({ $or : [{device: null}] })

  if(req.body.platform)
    conditions.push({ $or : [{platform: req.body.platform}] })
  else
    conditions.push({ $or : [{platform: null}] })

  if(req.body.platform_version)
    conditions.push({ $or : [{platform_version: req.body.platform_version}] })
  else
    conditions.push({ $or : [{platform_version: null}] })

  if(req.body.stage)
    conditions.push({ $or : [{stage: req.body.stage}] })
  else
    conditions.push({ $or : [{stage: null}] })

  query = {
      $and : conditions
  }
  Build.findOne(query).
  exec((err, foundBuild) ->
    if(err)
      return next err

    if(foundBuild)
      Build.updateAttributes(foundBuild,req.body)
      Build.updateStatus(foundBuild, req.body.status)
      foundBuild.save((err, rs) ->
        if(err)
          return next err
        res.json rs
      )
    else
      foundBuild = Build.initBuild(req.body)
      Build.updateStatus(foundBuild, req.body.status)

      foundBuild.save((err, rs) ->
        if err
          return next err
        res.json rs
      )
  );

# update build
router.put '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role,component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})
  Build.findOne({_id: req.params.id}).
  exec((err, build) ->
    if err
      next err

    if build
      #perform update
      Build.updateAttributes(build, req.body)
      build.save (err, results) ->
        if err
          next err

        res.json build
    else
      res.status(404)
      res.json {"error": "Cannot find Build with id " + req.params.id}
  );

router.delete '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role,component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})

  Build.deleteOne({_id: req.params.id}).
  exec((err, build) ->
    if err
      next err

    Test.deleteMany({build: req.params.id}).
      exec((err, rs) ->
        if err
          next err
        res.json rs
    );
  );

router.put '/status/:id',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role,component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})
  Build.findOne({_id: req.params.id}).
  exec((err, build) ->
    if err
      next err
    if build
      #perform update
      Build.updateStatus(build, req.body)
      build.save (err, results) ->
        if err
          next err
        res.json build
    else
      res.status(404)
      res.json {"error": "Cannot find Build with id " + req.params.id}
  );

router.post '/status/calculate/:id',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  if(req.body.is_update_build_status == undefined)
    isUpdateBuild = true
  else
    isUpdateBuild = req.body.is_update_build_status

  Test.aggregate()
  .match({ $and : [ { build : {$in : [ObjectId(req.params.id)]} }] })
  .group({ _id: "$uid", total: { $sum: 1 }, status: { $last: "$status" } })
  .group({ _id: "$status",total: { $sum:1 } })
  .exec((err, cols) ->
    if err
      next err      
    if(cols.length > 0)
      rs = { total: 0 }
      async.each(cols,
        (item,callback) ->
          rs[item._id.toLowerCase()]=item.total
          rs.total += item.total
          callback()
        (err) ->
          if err
            next err

          if(isUpdateBuild == true)
            # overwrite build status
            Build.findOne({_id: req.params.id}).
            exec((err, foundBuild) ->
              if(err)
                return next err

              if(foundBuild)
                # set defualt status to 0
                if(rs.pass == undefined)
                  rs.pass = 0
                if(rs.fail == undefined)
                  rs.fail = 0
                if(rs.skip == undefined)
                  rs.skip = 0

                foundBuild.status = rs
                foundBuild.end_time = Date.now()
                foundBuild.save((err, sbuild) ->
                  if(err)
                    return next err
                  res.json { 
                    status: rs, 
                    end_time: foundBuild.end_time
                  }
                )
              else
                res.status(404)
                res.json {message: "Cannot find build id " + req.params.id}
            )
          else
            res.json { status: rs, end_time: Date.now()}
      )
    else
      res.status(404)
      res.json {message: "Cannot find any tests with build id " + req.params.id}
  );

router.post '/status/latest',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  query = req.body.query
  Build.aggregate()
  .match({ $or : query })
  .group(
    { 
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
      build: { $last: "$build"},
      status: { $last: "$status"},
      start_time: { $last: "$start_time"}
  })
  .exec((err, cols) ->
    if err
      next err

    if(cols != undefined && cols.length > 0)
      res.json cols
    else
      res.status(404)
      res.json { message: 'Cannot find' }  
  );
  # res.json req.body

router.post '/comment/:id',  (req, res, next) ->
  Build.findOne({_id: req.params.id}).
  exec((err, build) ->
    if err
      return next(err)

    if build
      Build.addComment(build, req.body)
      build.save (err, results) ->
        if err
          return next(err)
        res.json build
    else
      res.status(404)
      res.json {"error": "Cannot find Build with id " + req.params.id}
  );

router.put '/comment/:id',  (req, res, next) ->
  Build.findOne({_id: req.params.id}).
  exec((err, build) ->
    if err
      return next(err)

    if build
      Build.updateComments(build, req.body)
      build.save (err, rs) ->
        if err
          return next(err)
        res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find build with id " + req.params.id}
  );

router.post '/outage/comment/:buildId',  (req, res, next) ->
  if(!req.body.search_type)
    res.status(400)
    return res.json {error: "search_type is mandatory"}

  if(!req.body.pattern)
    res.status(400)
    return res.json {error: "pattern is mandatory"}

  if(!req.body.comment)
    res.status(400)
    return res.json {error: "comment is mandatory"}
  
  Build.findOne({_id: req.params.buildId}).
  exec((err, build) ->
    if err
      return next(err)

    if build
      Build.addOutageComment(build, req.body)
      Build.findOneAndUpdate({ _id: new ObjectId(req.params.buildId) }, build,
          {
              upsert: true,
              new: true,
              runValidators: true
          },
          (err, rs) ->
              if err
                  return next(err)
              res.json rs
      )
      # build.save (err, results) ->
      #   if err
      #     return next(err)
      #   res.json build
    else
      res.status(404)
      res.json {"error": "Cannot find Build with id " + req.params.id}
  );

# add/update outage based on buildID
router.post '/outage/:buildId',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role,'outage'))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  Build.findOne({_id: req.params.buildId}).
  exec((err, build) ->
    if err
      return next(err)

    if build
      Build.manipulateOutage(build, req.body)
      Build.findOneAndUpdate({ _id: new ObjectId(req.params.buildId) }, build,
          {
              upsert: true,
              new: true,
              runValidators: true
          },
          (err, rs) ->
              if err
                  return next(err)
              res.json rs
      )
    else
      res.status(404)
      res.json {"error": "Cannot find Build with id " + req.params.buildId}
  );

router.post '/filter',  (req, res, next) ->
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
    conditions.push({ start_time: { $gt: since }})

  if(req.body.after)
    after = moment(req.body.after).format()  
    conditions.push({ start_time: { $lt: after }})

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

router.get '/entity/read',  (req, res, next) ->
  entities = ['product', 'type', 'version','device','team', 'browser']
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

router.get '/entity/producttype',  (req, res, next) ->
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

router.post '/entity/recommend',  (req, res, next) ->
  if(!req.body.product)
    res.status(400)
    return res.json {error: "Product is mandatory"}

  if(!req.body.type)
    res.status(400)
    return res.json {error: "Type is mandatory"}

  since = req.body.since || 300
  query = {
    product: req.body.product, 
    type: req.body.type, 
    start_time: { $gte: new Date(moment().subtract(since,'day').format()) }
  }

  if(req.body.version)
    query.version = { $regex: req.body.version, $options: 'i'}

  if(req.body.team)
    query.team = { $regex: req.body.team, $options: 'i'}

  if(req.body.browser)
    query.browser = { $regex: req.body.browser, $options: 'i'}

  if(req.body.device)
    query.device = { $regex: req.body.device, $options: 'i'}
  
  if(req.body.platform)
    query.platform = { $regex: req.body.platform, $options: 'i'}
  
  if(req.body.platform_version)
    query.platform_version = { $regex: req.body.platform_version, $options: 'i'}

  if(req.body.stage)
    query.stage = { $regex: req.body.stage, $options: 'i'}

  Build.aggregate() 
  .match(query)
  .group({
    _id: {
      $concat: ['$product', '_', '$type']
    }, 
    recommends: {
      $addToSet: {
        product: '$product',
        type: '$type',
        team: '$team',
        version: '$version', 
        browser: '$browser', 
        device: '$device', 
        platform: '$platform', 
        platform_version: '$platform_version',
        stage: '$stage'
      }
    }
  })
  .exec((err, recommends) ->
    if(recommends[0] != undefined)
      rs = recommends[0]
      if(rs.recommends != undefined)
        rs.total = rs.recommends.length
    else
      rs = recommends
    res.json rs
  );

router.post '/entity/others',  (req, res, next) ->
  if(!req.body.product)
    res.status(400)
    return res.json {error: "Product is mandatory"}

  if(!req.body.type)
    res.status(400)
    return res.json {error: "Type is mandatory"}

  key = 'entity'
  condition = { product : req.body.product, type: req.body.type}
  
  if(req.body.team)
    condition['team'] = req.body.team
  if(req.body.version)
    condition['version'] = req.body.version
  if(req.body.device)
    condition['device'] = req.body.device
  if(req.body.browser)
    condition['browser'] = req.body.browser
  if(req.body.platform)
    condition['platform'] = req.body.platform
  if(req.body.platform_version)
    condition['platform_version'] = req.body.platform_version
  if(req.body.stage)
    condition['stage'] = req.body.stage

  entities = ['version','device','team', 'browser', 'platform', 'platform_version', 'stage']
  async.map(entities,
    (item, callback) ->
        Build.distinct(item, condition).
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
  

router.post '/total',  (req, res, next) ->
    query = {}
    if(req.body.product)
      query.product = req.body.product

    if(req.body.type)
      query.type = req.body.type

    if(req.body.version)
      query.version = req.body.version

    if(req.body.team)
      query.team = req.body.team

    if(req.body.browser)
      query.browser = req.body.browser

    if(req.body.device)
      query.device = req.body.device
    
    if(req.body.platform)
      query.platform = req.body.platform
  
    if(req.body.platform_version)
      query.platform_version = req.body.platform_version

    if(req.body.stage)
      query.stage = req.body.stage
  
    if(req.body.untilDate)
      untilDate = moment(req.body.untilDate).format()
      query.start_time = {
        '$lt': new Date(untilDate)
      }

    Build.find(query)
    .count()
    .exec((err, count) ->
      if err
        return next(err)
      res.json count
    );

# purge
router.post '/purge/calculate',  (req, res, next) ->
    if(!req.body.product)
      res.status(400)
      return res.json {error: "Product is mandatory"}

    if(!req.body.type)
      res.status(400)
      return res.json {error: "Type is mandatory"}
    
    query = {}
    if(req.body.product)
      query.product = req.body.product

    if(req.body.type)
      query.type = req.body.type
  
    if(req.body.version)
      query.version = req.body.version

    if(req.body.team)
      query.team = req.body.team

    if(req.body.browser)
      query.browser = req.body.browser

    if(req.body.device)
      query.device = req.body.device
    
    if(req.body.platform)
      query.platform = req.body.platform
    
    if(req.body.platform_version)
      query.platform_version = req.body.platform_version

    if(req.body.stage)
      query.stage = req.body.stage
      
    if(req.body.untilDate)
      untilDate = moment(req.body.untilDate).format()
      query.start_time = {
        '$lt': new Date(untilDate)
      }

    Build.aggregate()
      .match(query)
      .lookup({
        from: "tests",
        localField: "_id",
        foreignField: "build",
        as: "total_tests"
      })
      .project({ 
        total_tests: { $size: "$total_tests" }
      })
      .exec((err, builds) ->
        if err
          next err
        if(builds)
          res.json builds
        else
          res.json {error: "cannot find any builds"}
      );

router.post '/purge',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  Build.deleteMany({_id : {$in : req.body.builds}}).
  exec((err, rsBuild) ->
    if err
      next err
    # console.log(req.body.builds)
    Test.deleteMany({ build : { $in : req.body.builds } }).
    exec((err, rs) ->
      if err
        next err
      res.json rs
    );
  );

# page
router.post '/:page/:perPage',  (req, res, next) ->
    if (!req.params.perPage)
      size = 10
    else if (req.params.perPage <= 0)
      size = 10
    else if (req.params.perPage > 50)
      size = 50
    else
      size = parseInt(req.params.perPage);

    page = parseInt(req.params.page)
    if (page < 0)
      response = { error: true, message: "invalid page number, should start with 0" };
      return res.json(response)

    query = {}
    if(req.body.product)
      query.product = req.body.product

    if(req.body.type)
      query.type = req.body.type

    if(req.body.version)
      query.version = req.body.version

    if(req.body.team)
      query.team = req.body.team

    if(req.body.browser)
      query.browser = req.body.browser

    if(req.body.device)
      query.device = req.body.device
    
    if(req.body.platform)
      query.platform = req.body.platform
  
    if(req.body.platform_version)
      query.platform_version = req.body.platform_version

    if(req.body.stage)
      query.stage = req.body.stage

    if(req.body.untilDate)
      untilDate = moment(req.body.untilDate).format()
      query.start_time = {
        '$lt': new Date(untilDate)
      }

    pagnition = {
      skip: size * page
    }

    if(req.body.sort)
      sort = req.body.sort
    else
      sort = {start_time: 'desc'}
    # invTest filter and condition
    Build.find(query, {}, pagnition)
    .limit(size)
    .sort(sort)
    .exec((err, builds) ->
      if err
        return next(err)
      res.json builds
    );

router.post '/search', (req, res, next) ->
  if(!req.body.specificQueries)
    if(!req.body.product)
      res.status(400)
      return res.json {error: "Product is mandatory"}

    if(!req.body.type)
      res.status(400)
      return res.json {error: "Type is mandatory"}

  range = -20
  if(req.body.range)
    range = (-req.body.range)

  query = {}

  if(req.body.specificQueries)
    query = { $or : req.body.specificQueries }
  else
    conditions = [
      { product: { $regex: req.body.product, $options: 'i'} },
      { type: { $regex: req.body.type, $options: 'i'} }
    ]

    if(req.body.since)
      conditions.push({ start_time: { $gte: new Date(moment().subtract(req.body.since,'day').format()) } })
  
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
  .match(query)
  .sort({start_time: 1})
  .group(
    { 
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


module.exports = router
