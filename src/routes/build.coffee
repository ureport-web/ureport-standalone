express = require('express')
router = express.Router()
moment = require('moment');

Build = require('../models/build')
ObjectId = require('mongoose').Types.ObjectId;
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

  query = {
      $and : conditions
  }
  Build.findOne(query).
  exec((err, foundBuild) ->
    if(err)
      return next err

    if(foundBuild)
      Build.updateAtttributes(foundBuild,req.body)
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
      Build.updateAtttributes(build, req.body)
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

    res.json build
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
      # build.save (err, rs) ->
      #   console.log("after save", rs)
      #   if err
      #     return next(err)
      #   res.json rs
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
        Build.distinct(item, {product : req.body.product, type: req.body.type}).
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

router.post '/entity/others',  (req, res, next) ->
  if(!req.body.product)
    res.status(400)
    return res.json {error: "Product is mandatory"}

  if(!req.body.type)
    res.status(400)
    return res.json {error: "Type is mandatory"}

  key = 'entity'
  entities = ['version','device','team', 'browser', 'platform', 'platform_version']
  async.map(entities,
    (item, callback) ->
        Build.distinct(item, {product : req.body.product, type: req.body.type}).
        exec((err, entity) ->
            _t = {}
            _t[item] = entity
            callback(err,_t)
        )
    (err,rs) ->
        if err
          return next(err) 
        res.json rs
        # req.app.locals.commonCache.set(key, rs)
        # .then( (result) ->
        #     next(result.err) if result.err
        #     res.json rs
        # )
  )
  # req.app.locals.commonCache.get(key)
  # .then( (crs)->
  #   next(err) if crs.err
  #   if crs.value[key] == undefined || req.query.isforce == 'true'
  #     async.map(entities,
  #         (item, callback) ->
  #             Build.distinct(item).
  #             exec((err, entity) ->
  #                 _t = {}
  #                 _t[item] = entity
  #                 callback(err,_t)
  #             )
  #         (err,rs) ->
  #             next(err) if err
  #             req.app.locals.commonCache.set(key, rs)
  #             .then( (result) ->
  #                 next(result.err) if result.err
  #                 res.json rs
  #             )
  #     )
  #   else
  #     req.app.locals.commonCache.getStats()
  #     .then( (rs) ->
  #         next(rs.err) if rs.err
  #         res.json crs.value[key]
  #     )
  # )

router.post '/total',  (req, res, next) ->
    query = {}
    if(req.body.product)
        query.product = req.body.product

    if(req.body.type)
        query.type = req.body.type

    Build.find(query)
    .count()
    .exec((err, count) ->
      if err
        return next(err)
      res.json count
    );

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
    
    console.log(query)
    pagnition = {
        skip: size * page
    }

    if(req.body.sort)
      sort = req.body.sort
    else
      sort = {create_at: 'desc'}
    # invTest filter and condition
    Build.find(query, {}, pagnition)
    .limit(size)
    .sort(sort)
    .exec((err, builds) ->
      if err
          return next(err)
      res.json builds
    );

module.exports = router
