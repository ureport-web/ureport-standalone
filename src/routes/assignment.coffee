express = require('express')
router = express.Router()
moment = require('moment');

Assignment = require('../models/assignment')
ObjectId = require('mongoose').Types.ObjectId;
async = require("async")

registerAudit = require('../utils/register_audit')
AccessControl = require('../utils/ac_grants')
send_assignment_email = require('../utils/send_assignment_email')
component = 'assignment'

router.get '/:id',  (req, res, next) ->
  Assignment.findOne({_id: req.params.id}).
  exec((err, rs) ->
    if(err)
      next err

    if(rs)
      res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Assignment with id " + req.params.id}
  );

router.get '/my/:userid',  (req, res, next) ->
  Assignment.find({user: req.params.userid}).
  sort({"assign_at": -1}).
  exec((err, rs) ->
    if(err)
      next err

    if(rs)
      res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find Assignments with userid " + req.params.userid}
  );

router.post '/filter',  (req, res, next) ->
  if(!req.body.product)
    res.status(400)
    return res.json {error: "Product is mandatory"}

  if(!req.body.type)
    res.status(400)
    return res.json {error: "Type is mandatory"}
  
  after = moment().format()  
  if(req.body.after)
    after = moment(req.body.after).format()

  state = "OPEN"
  if(req.body.state)
    state = req.body.state

  query = {
    $and:[ 
      { $or: req.body.product },
      { $or: req.body.type },
      { assign_at: { $gte:  after } }, 
      { state: state }
    ]
  }

  Assignment.find(query).
  sort({"assign_at": -1}).
  exec((err, cases) ->
    if(err)
      next err
    res.json cases
  );

router.post '/',  (req, res, next) ->
  if (!AccessControl.canAccessCreateAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})

  if(!req.body.user && !req.body.username)
    res.status(400)
    return res.json ({error: "key user or username is requried"})
  
  if(req.body.product && req.body.type && req.body.uid)
    Assignment.find({ product: req.body.product, type: req.body.type, uid: req.body.uid, state: "OPEN" })
    .exec((err, assignments) ->
      if(err)
        return next(err)
      # check existing assignemnt has the same failure with the new one
      if(assignments)
        async.detect(assignments,
        (item, callback) ->
          Assignment.hasSameFailure(req.body, item, callback)
        (err,assignment) ->
          # console.log(assignment)
          if(assignment)
            Assignment.appendAssignment(assignment, req.body)
            assignment.save (err, rs) ->
              if err
                return next(err)
              send_assignment_email(req,res,req.body,rs)
              registerAudit(req,res,"Change Assignment to " + req.body.username, "ASSIGN")
              res.json rs
          else
            new Assignment(req.body).save((err, rs) ->
              if err
                return next(err)
              send_assignment_email(req,res,req.body,rs)
              registerAudit(req,res,"Assign to " + req.body.username, "ASSIGN")
              res.json rs
            )
          )
      else
        new Assignment(req.body).save((err, rs) ->
            if err
              return next(err)
            send_assignment_email(req,res,req.body,rs)
            registerAudit(req,res,"Assign to " + req.body.username, "ASSIGN")
            res.json rs
          )
      )
  else if (req.body.product)
    new Assignment(req.body).save((err, rs) ->
        if err
          return next(err)
        send_assignment_email(req,res,req.body,rs)
        registerAudit(req,res,"Assign to" + req.body.username, "ASSIGN")
        res.json rs
      )
  else
    res.status(400)
    return res.json {error: "Missing mandatory parameters: Product, type or uid"}

#mainly used for unassign
router.put '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessUpdateAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
  
  Assignment.findOne({_id: req.params.id}).
  exec((err, assignment) ->
    if err
      return next(err)

    if assignment
      #perform update
      Assignment.update(assignment, req.body)
      assignment.save (err, rs) ->
        if err
          return next(err)
        if(req.body.state && req.body.username) # for possible assign update, but usually user should not use this to update assignemnt
          req.body.uid = assignment.uid  # set for audit purpose
          req.body.product = assignment.product  # set for audit purpose
          req.body.type = assignment.type  # set for audit purpose
          if(req.body.state != 'CLOSE')
            registerAudit(req,res,"Update Assignment to " + req.body.username, "UPDATE")
          else
            registerAudit(req,res,"Unassign from " + rs.username, "UNASSIGN")
        res.json rs
    else
      res.status(404)
      return res.json {"error": "Cannot find Assignment with id " + req.params.id}
  );

router.delete '/:id',  (req, res, next) ->
  if (!AccessControl.canAccessDeleteAny(req.user.role,component))
    return res.status(403).json({"error": "You don't have permission to perform this action"})
  
  Assignment.findOneAndRemove({_id: req.params.id}).
  exec((err, assignment) ->
    if err
      return next(err)
    req.body.uid = assignment.uid  # set for audit purpose
    req.body.product = assignment.product  # set for audit purpose
    req.body.type = assignment.type  # set for audit purpose
    registerAudit(req,res,"Unassignment", "DELETE")
    res.json assignment
  );

router.post '/comment/:id',  (req, res, next) ->
  Assignment.findOne({_id: req.params.id}).
  exec((err, assignment) ->
    if err
      return next(err)

    if assignment
      Assignment.addComment(assignment, req.body)
      assignment.save (err, rs) ->
        if err
          return next(err)
        res.json rs
    else
      res.status(404)
      return res.json {"error": "Cannot find assignment with id " + req.params.id}
  );

router.put '/comment/:id',  (req, res, next) ->
  Assignment.findOne({_id: req.params.id}).
  exec((err, assignment) ->
    if err
      return next(err)
    if assignment
      Assignment.updateComment(assignment, req.body)
      assignment.save (err, rs) ->
        if err
          return next(err)
        res.json rs
    else
      res.status(404)
      return res.json {"error": "Cannot find assignment with id " + req.params.id}
  );

module.exports = router
