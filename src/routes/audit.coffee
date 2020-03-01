express = require('express')
router = express.Router()
moment = require('moment');

Audit = require('../models/audit')
ObjectId = require('mongoose').Types.ObjectId;

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

module.exports = router