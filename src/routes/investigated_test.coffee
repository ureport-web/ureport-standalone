express = require('express')
moment = require('moment');
async = require("async")

router = express.Router()
InvestigatedTest = require('../models/investigated_test')
ObjectId = require('mongoose').Types.ObjectId;

registerAudit = require('../utils/register_audit')
AccessControl = require('../utils/ac_grants')
getSystemSetting = require('../utils/getSystemSetting')

component = 'investigate'

router.get '/:id',  (req, res, next) ->
    InvestigatedTest.findOne({
      _id: new ObjectId(req.params.id)
    }).
    exec((err, test) ->
      res.json test
    );
###
 * [create a investigated test object]
###
router.post '/',  (req, res, next) ->
    action = "CREATE"
    if(req.body._id != undefined)
        condition = { _id: new ObjectId(req.body._id) }
        action = "UPDATE"
        if (!AccessControl.canAccessUpdateAny(req.user.role,component))
            return res.status(403).json({"error": "You don't have permission to perform this action"})
    else
        condition = { uid: 'ureport-does-not-exist' }
        if (!AccessControl.canAccessCreateAny(req.user.role,component))
            return res.status(403).json({"error": "You don't have permission to perform this action"})
    InvestigatedTest.findOneAndUpdate(condition, req.body,
        {
            upsert: true,
            new: true,
            runValidators: true
        },
        (err, invTest) ->
            if err
                return next(err)
            registerAudit(req, res, "Mark As Investigated", action)
            res.json invTest
    )

router.post '/multi',  (req, res, next) ->
    if (!AccessControl.canAccessCreateAny(req.user.role,component))
        return res.status(403).json({"error": "You don't have permission to perform this action"})

    InvestigatedTest.insertMany(req.body, (err, invTests) ->
        if(err)
          res.json err
        else
          res.json invTests
    );

router.delete '/:id/:user',  (req, res, next) ->
    if(req.user.role != 'admin')
        if (!AccessControl.canAccessDeleteAnyIfOwn(req.user, req.params.user, component))
            return res.status(403).json({"error": "You don't have permission to perform this action"})

    InvestigatedTest.findOneAndRemove({_id: req.params.id}).
    exec((err, invTest) ->
        if err
            return next(err)
        req.body.uid = invTest.uid  # set for audit purpose
        req.body.product = invTest.product  # set for audit purpose
        req.body.type = invTest.type  # set for audit purpose
        registerAudit(req, res, "Remove Investigated Mark", "DELETE")
        res.json invTest
    );

router.post '/total',  (req, res, next) ->
    query = {}
    if(req.body.filter)
    # query.uid = {'$regex': req.body.filter}
        query = {
            $and : [
                $or : [ 
                    { uid: {'$regex': req.body.filter} }, 
                    { "tracking.track_number": {'$regex': req.body.filter} }, 
                ]
            ]
        }
    if(req.body.product)
        query.product = req.body.product

    if(req.body.type)
        query.type = req.body.type

    # if(req.body.filter)
    #     query.uid = {'$regex': req.body.filter}
    # invTest filter and condition
    InvestigatedTest.find(query)
    .count()
    .exec((err, count) ->
        if err
            return next(err)
        res.json count
    );

router.post '/filter',  (req, res, next) ->
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

        if(req.body.activeRegEx)
            query = { $and : [
                { product: { $regex: req.body.product, $options: 'i'} },
                { type: { $regex: req.body.type, $options: 'i'} },
                { create_at: { $gte: new Date(moment().subtract(sinceDay,'day').format()) } }
            ]}
        else
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

router.post '/comment/:id',  (req, res, next) ->
  InvestigatedTest.findOne({_id: req.params.id}).
  exec((err, investigated) ->
    if err
      return next(err)

    if investigated
      InvestigatedTest.addComment(investigated, req.body)
      investigated.save (err, rs) ->
        if err
          return next(err)
        res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find investigated test with id " + req.params.id}
  );

router.put '/comment/:id',  (req, res, next) ->
  InvestigatedTest.findOne({_id: req.params.id}).
  exec((err, investigated) ->
    if err
      return next(err)

    if investigated
      InvestigatedTest.updateComment(investigated, req.body)
      investigated.save (err, rs) ->
        if err
          return next(err)
        res.json rs
    else
      res.status(404)
      res.json {"error": "Cannot find investigated test with id " + req.params.id}
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
    # { $or : [{"uid":{'$regex': '496'}}, {"tracking.track_number":{'$regex': '496'}}] }
    if(req.body.filter)
        # query.uid = {'$regex': req.body.filter}
        query = {
            $and : [
                $or : [ 
                    { uid: {'$regex': req.body.filter} }, 
                    { "tracking.track_number": {'$regex': req.body.filter} }, 
                ]
            ]
        }

    if(req.body.product)
        query.product = req.body.product

    if(req.body.type)
        query.type = req.body.type

    pagnition = {
        skip: size * page
    }

    if(req.body.sort)
        sort = req.body.sort
    else
        sort = {create_at: 'desc'}
    # invTest filter and condition
    InvestigatedTest.find(query, {}, pagnition)
    .limit(size)
    .sort(sort)
    .exec((err, invTests) ->
        if err
            return next(err)
        res.json invTests
    );

module.exports = router
