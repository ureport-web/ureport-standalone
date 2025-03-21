Audit = require('../models/audit')

module.exports = (req, res, audit_type, action) ->
    addAudit = ->
        res.removeListener('finish', addAudit)
        audit = new Audit({
            audit_type: audit_type,
            action: action,
            uid: if req.body.uid then req.body.uid else "",
            product: if req.body.product then req.body.product else "UNKNOWN",
            type: if req.body.type then req.body.type else "UNKNOWN",
            username: if req.user then req.user.username else ""
            user: if req.user then req.user._id else "",
            failure: if req.body.failure then req.body.failure else ""
        })
        audit.save((err, rs) ->
            if(err)
                console.log("cannot create audit", err)
            return
        );

    res.on('finish', addAudit);
