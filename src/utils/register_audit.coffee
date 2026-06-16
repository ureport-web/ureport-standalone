Audit = require('../models/audit')
logger = require('./logger')

module.exports = (req, res, audit_type, action, entity_type = 'test', overrides = {}) ->
    addAudit = ->
        res.removeListener('finish', addAudit)
        # Only audit successful operations — avoids false records on 403/404/400
        return unless res.statusCode < 400
        ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() or req.ip or ""
        audit = new Audit({
            audit_type: audit_type,
            action: action,
            uid: if overrides.uid then overrides.uid else if req.body.uid then req.body.uid else "",
            product: if overrides.product then overrides.product else if req.body.product then req.body.product else "UNKNOWN",
            type: if overrides.type then overrides.type else if req.body.type then req.body.type else "UNKNOWN",
            username: if req.user then req.user.username else ""
            user: if req.user then req.user._id else "",
            failure: if req.body.failure then req.body.failure else "",
            entity_type: entity_type,
            ip: ip
        })
        audit.save((err, rs) ->
            if(err)
                logger.error("cannot create audit", err)
            return
        );

    res.on('finish', addAudit);
