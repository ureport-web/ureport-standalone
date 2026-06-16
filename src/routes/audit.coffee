express = require('express')
router = express.Router()
moment = require('moment');

Audit = require('../models/audit')
ObjectId = require('mongoose').Types.ObjectId;
AccessControl = require('../utils/ac_grants')

# router.delete '/:id',  (req, res, next) ->
#   Audit.deleteOne({_id: req.params.id}).
#   exec((err, rs) ->
#     if err
#       next err

#     res.json rs
#   );

router.post '/filter',  (req, res, next) ->
    if(!req.body.product)
        res.status(400)
        return res.json {error: "Product is mandatory"}

    if(!req.body.type)
        res.status(400)
        return res.json {error: "Type is mandatory"}

    if(!req.body.uid)
        res.status(400)
        return res.json {error: "UID is mandatory"}

    if(!req.body.since)
        res.status(400)
        return res.json {error: "Since is mandatory"}

    query = {
      product: req.body.product
      type: req.body.type
      uid: req.body.uid,
      create_at: { $gte: moment(req.body.since).format() }
    }
    # invTest filter and condition
    Audit.find(query).
    sort({"create_at": -1}).
    exec((err, rs) ->
        if err
          next err
        res.json rs
    );

router.post '/admin/filter', (req, res, next) ->
    if (!AccessControl.canAccessReadAny(req.user?.role, 'audit'))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    page = parseInt(req.body.page) or 1
    perPage = parseInt(req.body.perPage) or 50
    query = {}

    if req.body.since
        query.create_at = query.create_at or {}
        query.create_at['$gte'] = moment(req.body.since).toDate()
    if req.body.until
        query.create_at = query.create_at or {}
        query.create_at['$lte'] = moment(req.body.until).toDate()
    if req.body.username
        query.username = req.body.username
    if req.body.entity_type
        if Array.isArray(req.body.entity_type) and req.body.entity_type.length > 0
            query.entity_type = { $in: req.body.entity_type }
        else if not Array.isArray(req.body.entity_type)
            query.entity_type = req.body.entity_type
    if req.body.audit_type
        query.audit_type = req.body.audit_type

    Audit.find(query).sort({create_at: -1}).skip((page - 1) * perPage).limit(perPage).exec (err, records) ->
        if err
            return next err
        Audit.countDocuments(query).exec (err2, total) ->
            if err2
                return next err2
            res.json { records: records, total: total }

module.exports = router