express = require('express')
router = express.Router()
Dependency = require('../models/dependency')

AccessControl = require('../utils/ac_grants')
component = 'dependency'

router.post '/:page/:perPage',  (req, res, next) ->
    if (!AccessControl.canAccessReadAny(req.user.role,component))
      return res.status(403).json({"error": "You don't have permission to perform this action"})

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
    if(req.body.filter)
      query.name = {'$regex': req.body.filter}

    pagnition = {
      skip: size * page
    }

    if(req.body.sort)
      sort = req.body.sort
    else
      sort = {name: 'desc'}
    # invTest filter and condition
    Dependency.find(query, { password:0 }, pagnition)
    .limit(size)
    .sort(sort)
    .exec((err, deps) ->
        if err
            return next(err)
        res.json deps
    );

router.post '/total',  (req, res, next) ->
    query = {}

    if(req.body.filter)
      query.uid = {'$regex': req.body.filter}
    # invTest filter and condition
    Dependency.find(query)
    .count()
    .exec((err, count) ->
      if err
        return next(err)
      res.json count
    );

#create the login get and post routes
router.post '/search', (req, res, next) ->
    if (!AccessControl.canAccessReadAny(req.user.role,component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    if(!req.body.name)
      res.status(400)
      return res.json {error: "Please provide a dependency name"}

    regex = new RegExp(req.body.name.trim())
    Dependency.find({
      name: { $regex: regex, $options: 'i' }
    }, { password:0 }).
    exec((err, deps) ->
      if(err)
        return next(err)
      res.json deps
    );

# create
router.post '/',  (req, res, next) ->
  if(req.body._id != undefined)
    condition = { _id: new ObjectId(req.body._id) }
  else
    if(req.body.key)
      condition = { key: req.body.key }
    else
      condition = { key: req.body.key }

  Dependency.findOneAndUpdate(condition, req.body,
    {
      upsert: true,
      new: true,
      runValidators: true
    },
    (err, deps) ->
      if err
        next err
      res.json deps
  )

# update
router.put '/update/:name',  (req, res, next) ->
  if(!AccessControl.canAccessUpdateAny(req.user.role, component))
    if (!AccessControl.canAccessUpdateAnyIfOwnByName(req.user, req.params.name, component))
      return res.status(403).json({"error": "You don't have permission"})
  if(req.body.password)
    return res.status(400).json({"error": "Cannot update password through user update, please use /reset to update the password"})
  
  if(req.user.role !='admin' && req.body.role)
    return res.status(400).json({"error": "You are not admin, and you cannot update the role field."})

  # in case user update username, we need to see if the new username exist or not in the system
  if(req.body.name && req.body.name != req.params.name)
    Dependency.findOne({
      name: req.body.name
    }).exec((err, user) ->
      if(err)
        return next(err)
      if(user)
        return res.status(400).json({"error": "Cannot update dependency to "+ req.body.name+". It has been taken already! Please choose a different one."})
      else
        Dependency.findOne({
        name: req.params.name
        }).
        exec((err, dep) ->
            if(err)
              return next(err)
            if(dep)
              Dependency.update(dep, req.body)
              dep.save (err, rs) ->
                if err
                  return next err
                res.json rs
        );
    );
  else
    Dependency.findOne({
      name: req.params.name
    }).
    exec((err, user) ->
        if(err)
          return next(err)
        if(dep)
          Dependency.updateOne(dep, req.body)
          dep.save (err, rs) ->
            if err
              return next err
            res.json rs
        else
          return res.status(400).json({"error": "Cannot find username "+ req.params.username+" to update."})
    );

# Delete dependency
router.delete '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role, component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  Dependency.deleteOne({_id: req.params.id}).
  exec((err, rs) ->
    if err
      return next(err)
    res.json rs
  );

module.exports = router