mongoose = require('mongoose')
logger = require('./logger')
{ DEFAULT_RETENTION_DAYS } = require('../models/audit')

# Update the TTL index on the audits collection.
# Uses drop+recreate instead of collMod — compatible with both MongoDB and DocumentDB.
# MongoDB TTL monitor runs every 60s so new expiry takes effect within ~1 minute.
module.exports = (days, callback) ->
    days = parseInt(days)
    if isNaN(days) or days < 7
        days = DEFAULT_RETENTION_DAYS
    seconds = days * 86400
    unless mongoose.connection.readyState is 1
        logger.warn '[audit-ttl] DB not connected, skipping TTL update'
        return callback?(null)
    collection = mongoose.connection.collection('audits')
    createWithRetry = (attemptsLeft) ->
        collection.createIndex(
            { create_at: 1 },
            { expireAfterSeconds: seconds, background: true },
            (err) ->
                if err
                    if err.code is 40333 and attemptsLeft > 0
                        logger.warn "[audit-ttl] Index build in progress, retrying in 5s (#{attemptsLeft} attempts left)"
                        setTimeout (-> createWithRetry(attemptsLeft - 1)), 5000
                    else
                        logger.error '[audit-ttl] Failed to recreate TTL index', err
                        callback?(err)
                else
                    logger.info "[audit-ttl] Retention set to #{days} days (#{seconds}s)"
                    callback?(null)
        )
    collection.dropIndex({ create_at: 1 }, (dropErr) ->
        # Ignore error if index didn't exist yet
        createWithRetry(6)
    )
