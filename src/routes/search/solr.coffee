express = require('express')
router = express.Router()
SolrNode = require('solr-node');
config = require('config')


router.post '/solr',  (req, res, next) ->
    if(!req.body.query)
        res.status(400)
        return res.json {error: "Please provide a query to search"}
    if(!req.body.core)
        res.status(400)
        return res.json {error: "Please provide a core to search in"}

    client = new SolrNode({
        host: 'localhost',
        port: 8983,
        core: req.body.core,
        protocol: 'http'
    });

    row = 100 

    if (req.body.fl)
        fl = req.body.fl

    if (req.body.row)
        row = req.body.row

    strQuery = client.query()
    .q(req.body.query)
    .fl(fl)
    .rows(row)
    .addParams({
        wt: 'json',
        indent: true
    });

    client.search(strQuery,  (err, result) ->
        if (err)
            console.log(err)
            return res.json err
        res.json result.response
    )
    
module.exports = router
