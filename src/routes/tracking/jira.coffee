express = require('express')
router = express.Router()
getSystemSetting = require('../../utils/getSystemSetting')

JiraClient = require('jira-connector');

async = require("async");

router.post '/issue',  (req, res, next) ->
    if(!req.body.issueKey)
        res.status(400)
        return res.json {error: "Issue Key is mandatory"}

    getSystemSetting(req, "SYSTEM_SETTING", false, (setting) ->
        if(!setting || !setting.issue_tracking || !setting.issue_tracking.url)
            return res.json {error: "Missing issue tracking setup"}
        jira = new JiraClient( {
            host: setting.issue_tracking.url
            basic_auth: {
                base64: setting.issue_tracking.base64
            }
        })
        jira.issue.getIssue {issueKey: req.body.issueKey, fields: ["status", "updated", "priority", "assignee"]}, (error, issue) ->
            if(error)
                res.status(404)
                return res.json error
            res.json issue
    )

router.post '/clear/cache',  (req, res, next) ->
    if(!req.body.key)
        res.status(400)
        return res.json {error: "Product and Type key is mandatory"}

    req.app.locals.commonCache.get(req.body.key)
    .then( (crs)->
        if crs.value[req.body.key] == undefined
            res.json {status: "success"}
        else
            rs = req.app.locals.commonCache.del(req.body.key)
            res.json rs
    )

router.post '/findAll',  (req, res, next) ->
    if(!req.body.key)
        res.status(400)
        return res.json {error: "Product and Type key is mandatory"}
    
    getSystemSetting(req, "SYSTEM_SETTING", false, (setting) ->
        if(!setting || !setting.issue_tracking || !setting.issue_tracking.url)
            return res.json {error: "Missing issue tracking setup"}
        jira = new JiraClient( {
            host: setting.issue_tracking.url
            basic_auth: {
                base64: setting.issue_tracking.base64
            }
        })
        
        req.app.locals.commonCache.get(req.body.key)
        .then( (crs)->
            return next(crs.err) if crs.err
            if crs.value[req.body.key] == undefined
                async.map(req.body.query,
                    (item, callback) ->
                        jira.search.search {jql: item, fields: ["status", "updated", "priority", "assignee"]}, (error, rs) ->
                            if(rs)
                                callback(error,rs.issues)
                            else
                                callback(error,[])
                    (err,rs) ->
                        if err
                            return next(err)
                        else
                            issues = rs.reduce( ((a, b) -> a.concat b ), [] )
                            req.app.locals.commonCache.set(req.body.key, issues)
                            .then( (result) ->
                                if result.err
                                    return next(result.err)
                                else
                                    res.json issues
                            )
                )
            else
                req.app.locals.commonCache.getStats()
                .then( (rs) ->
                    if rs.err
                        return next(rs.err)
                    res.json crs.value[req.body.key]
                )
        )
    )

module.exports = router
