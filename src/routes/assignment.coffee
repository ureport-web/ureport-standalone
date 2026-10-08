express = require('express')
router = express.Router()
moment = require('moment');

Assignment = require('../models/assignment')
ObjectId = require('mongoose').Types.ObjectId;
async = require("async")

registerAudit = require('../utils/register_audit')
AccessControl = require('../utils/ac_grants')
send_assignment_email      = require('../utils/send_assignment_email')
send_followup_email        = require('../utils/send_followup_email')
send_bulk_assignment_email = require('../utils/send_bulk_assignment_email')
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

# Search assignments with optional filters — used by assignments page
# Body: { product?, type?, username?, state?, after?, limit? }
router.post '/search', (req, res, next) ->
  conditions = []

  if req.body.product
    conditions.push { product: req.body.product }
  if req.body.type
    conditions.push { type: req.body.type }
  if req.body.username
    conditions.push { username: req.body.username }

  state = req.body.state or 'OPEN'
  conditions.push { state: state }

  after = moment().subtract(90, 'days').toISOString()
  if req.body.after
    after = moment(req.body.after).format()
  conditions.push { assign_at: { $gte: after } }

  query = if conditions.length > 0 then { $and: conditions } else {}
  limit = Math.min(req.body.limit or 200, 500)

  Assignment.find(query)
  .sort({ assign_at: -1 })
  .limit(limit)
  .exec (err, cases) ->
    if err then return next(err)
    res.json cases

# Bulk create assignments — max 50 per request
# Body: { assignments: [{ uid, product, type, username, user?, failure, test_url? }, ...] }
router.post '/bulk', (req, res, next) ->
  if !AccessControl.canAccessCreateAny(req.user.role, component)
    return res.status(403).json {error: "You don't have permission to perform this action"}

  items = req.body.assignments
  if !items or !Array.isArray(items) or items.length == 0
    return res.status(400).json {error: "assignments array is required"}
  if items.length > 50
    return res.status(400).json {error: "Maximum 50 assignments per bulk request"}

  created = 0
  updated = 0

  async.eachSeries items, (item, next) ->
    if !item.uid or !item.product or !item.type
      return next()
    Assignment.find({ product: item.product, type: item.type, uid: item.uid, state: 'OPEN' })
    .exec (err, existing) ->
      if err then return next(err)
      if existing and existing.length > 0
        # Update existing — append assignee
        async.detect existing, (a, cb) ->
          Assignment.hasSameFailure(item, a, cb)
        , (err, match) ->
          target = match or existing[0]
          Assignment.appendAssignment(target, item)
          target.save (err) ->
            if err then return next(err)
            updated++
            next()
      else
        new Assignment(item).save (err) ->
          if err then return next(err)
          created++
          next()
  , (err) ->
    if err then return next(err)

    # Group by assignee for one email per user
    grouped = {}
    items.forEach (a) ->
      key = String(a.user or a.username)
      if !grouped[key]
        grouped[key] = { userId: a.user, username: a.username, items: [] }
      grouped[key].items.push a

    groupedList = Object.values(grouped).filter (g) ->
      g.username != req.user.username

    res.json { created, updated, total: items.length }
    send_bulk_assignment_email req, res, groupedList, ->
      registerAudit(req, res, "Bulk assigned #{items.length} test(s)", "ASSIGN")

# Send follow-up reminder emails for specific assignment IDs
# Body: { ids: [assignmentId, ...] }
# Bulk resolve assignments by id — called after triage to auto-close open assignments
# Body: { ids: [assignmentId, ...] }
router.put '/resolve/bulk', (req, res, next) ->
  if !req.body.ids or !Array.isArray(req.body.ids) or req.body.ids.length == 0
    return res.status(400).json {error: "ids array is required"}

  Assignment.updateMany(
    { _id: { $in: req.body.ids }, state: 'OPEN' },
    { state: 'RESOLVED' }
  ).exec (err, result) ->
    if err then return next(err)
    res.json { resolved: result.nModified or result.modifiedCount or 0 }

router.post '/followup', (req, res, next) ->
  if !req.body.ids or !Array.isArray(req.body.ids) or req.body.ids.length == 0
    res.status(400)
    return res.json {error: "ids array is required"}

  Assignment.find({ _id: { $in: req.body.ids }, state: 'OPEN' })
  .exec (err, assignments) ->
    if err then return next(err)
    if !assignments or assignments.length == 0
      return res.json { sent: 0, message: 'No open assignments found' }

    # Group by user
    grouped = {}
    assignments.forEach (a) ->
      key = String(a.user or a.username)
      if !grouped[key]
        grouped[key] = { userId: a.user, username: a.username, items: [] }
      grouped[key].items.push a

    groupedList = Object.values(grouped).filter (g) ->
      g.username != req.user.username

    res.json { sent: groupedList.length }
    send_followup_email req, res, groupedList, ->
      registerAudit(req, res, "Follow-up emails sent to #{groupedList.length} assignee(s)", "FOLLOWUP")

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
