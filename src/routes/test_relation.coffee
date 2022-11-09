express = require('express')
router = express.Router()

TestRelation = require('../models/test_relation')
async = require("async")
ObjectId = require('mongoose').Types.ObjectId;

router.get '/:id',  (req, res, next) ->
    TestRelation.findOne({
      _id: new ObjectId(req.params.id)
    }).
    exec((err, test) ->
      res.json test
    );

router.post '/total',  (req, res, next) ->
    query = {}
    if(req.body.product)
        query.product = req.body.product

    if(req.body.type)
        query.type = req.body.type

    if(req.body.filter)
        query.uid = {'$regex': req.body.filter}
    # invTest filter and condition
    TestRelation.find(query)
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

    if(req.body.activeRegEx)
        query = { $and : [
            { product: { $regex: req.body.product, $options: 'i'} },
            { type: { $regex: req.body.type, $options: 'i'} }
        ]}
    else
        query = {
            product: req.body.product
            type: req.body.type
        }

    #build exclude doc
    if(req.body.exclude)
        exclude = {}
        TestRelation.buildExcludeFieldQuery(exclude,req.body.exclude)

    TestRelation.find(query,exclude).
    exec((err, tests) ->
        if(err)
          next err
        res.json tests
    );

###
 * [create a test relation test object]
###
router.post '/',  (req, res, next) ->
    if(req.body._id != undefined)
        condition = { _id: new ObjectId(req.body._id) }
    else
        condition = { uid: 'ureport-does-not-exist' }

    TestRelation.findOneAndUpdate(condition, req.body,
        {
            upsert: true,
            new: true,
            runValidators: true
        },
        (err, relation) ->
            if err
                next err
            res.json relation
    )

router.post '/update/attributes',  (req, res, next) ->
    if(req.body._id == undefined)
        res.status(400)
        return res.json { error: "Relation Id is mandatory" }
    TestRelation.findOne({_id: req.body._id}).
    exec((err, relation) ->
        if err
          next err
        if relation
          #perform update
          TestRelation.update(relation, req.body)
          relation.save (err, results) ->
            if err
              next err

            res.json relation
        else
          res.status(404)
          res.json {"error": "Cannot find Relation with id " + req.params.id}
    )

router.delete '/:id',  (req, res, next) ->
    TestRelation.deleteOne({_id: req.params.id}).
    exec((err, relation) ->
        if err
            return next(err)
        res.json relation
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

    if(req.body.filter)
        query.uid = {'$regex': req.body.filter}

    pagnition = {
        skip: size * page
    }

    if(req.body.sort)
        sort = req.body.sort
    else
        sort = {uid: 'desc'}
    # invTest filter and condition
    TestRelation.find(query, {}, pagnition)
    .limit(size)
    .sort(sort)
    .exec((err, relations) ->
        if err
            return next(err)
        res.json relations
    );

module.exports = router
