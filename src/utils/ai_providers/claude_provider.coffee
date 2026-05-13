https = require('https')

class ClaudeProvider
  constructor: (apiKey, model) ->
    @apiKey = apiKey
    @model = model or 'claude-haiku-4-5-20251001'

  chat: (systemPrompt, userMessage, callback) ->
    body = JSON.stringify({
      model: @model
      max_tokens: 1024
      system: systemPrompt
      messages: [
        { role: 'user', content: userMessage }
      ]
    })

    options = {
      hostname: 'api.anthropic.com'
      port: 443
      path: '/v1/messages'
      method: 'POST'
      headers: {
        'Content-Type': 'application/json'
        'Content-Length': Buffer.byteLength(body)
        'x-api-key': @apiKey
        'anthropic-version': '2023-06-01'
      }
    }

    req = https.request(options, (res) ->
      data = ''
      res.on('data', (chunk) -> data += chunk)
      res.on('end', ->
        try
          parsed = JSON.parse(data)
          if parsed.error
            callback(new Error(parsed.error.message), null)
          else
            text = parsed.content?[0]?.text or ''
            callback(null, text)
        catch e
          callback(e, null)
      )
    )

    req.on('error', (e) -> callback(e, null))
    req.write(body)
    req.end()

module.exports = ClaudeProvider
