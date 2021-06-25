express = require('express')
router = express.Router()
UserFav = require('../models/userFavorite')

AccessControl = require('../utils/ac_grants')
component = 'userFav'

router.get '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessCreateAnyIfOwn(req.user, req.params.id, component))
    return res.status(403).json({"error": "You don't have permission"})

  UserFav.findOne({
    userid: req.params.id
  }).
  exec((err, userFav) ->
    if(err)
      return next(err)
    else
      res.json userFav
  );

router.post '/',  (req, res, next) ->
  if (!AccessControl.canAccessCreateAnyIfOwn(req.user, req.body.userid, component))
    return res.status(403).json({"error": "You don't have permission"})

  UserFav.findOne({
    userid: req.body.userid
  }).
  exec((err, userFav) ->
    if(err)
      return next(err)
    # in case the userFav exist, we update only
    if(userFav)
      UserFav.updateOne(userFav, req.body)
    else
      userFav = new UserFav(req.body)

    userFav.save((err, rs) ->
      if err
        return next(err)
      res.json rs
    );
  );

# update
router.put '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAnyIfOwn(req.user, req.params.id, component))
    return res.status(403).json({"error": "You don't have permission"})

  UserFav.findOne({
    userid: req.params.id
  }).
  exec((err, userFav) ->
    if(err)
      return next(err)
    if(userFav)
      UserFav.updateOne(userFav, req.body)
      userFav.save (err, rs) ->
        if err
          return next err
        res.json rs
    else
      req.body.userid = req.params.id
      userFav = new UserFav(req.body)
      userFav.save (err, rs) ->
        if err
          return next(err)
        res.json rs
  );

# Delete
router.delete '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAnyIfOwn(req.user, req.params.id, component))
    return res.status(403).json({"error": "You don't have permission"})

  UserFav.deleteOne({_id: req.params.id}).
  exec((err, rs) ->
    if err
      return next(err)
    res.json rs
  );

module.exports = router