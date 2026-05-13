http = require('http')
https = require('https')
url = require('url')

class OllamaProvider
  constructor: (model, baseUrl) ->
    @model = model or 'llama3.2'
    @baseUrl = baseUrl or 'http://localhost:11434'

  chat: (systemPrompt, userMessage, callback) ->
    body = JSON.stringify({
      model: @model
      messages: [
        { role: 'system', content: systemPrompt }
        { role: 'user', content: userMessage }
      ]
      stream: false
    })

    parsed = url.parse(@baseUrl)
    isHttps = parsed.protocol is 'https:'
    transport = if isHttps then https else http
    port = if parsed.port then parseInt(parsed.port) else (if isHttps then 443 else 80)

    options = {
      hostname: parsed.hostname
      port: port
      path: '/api/chat'
      method: 'POST'
      headers: {
        'Content-Type': 'application/json'
        'Content-Length': Buffer.byteLength(body)
      }
    }

    req = transport.request(options, (res) ->
      data = ''
      res.on('data', (chunk) -> data += chunk)
      res.on('end', ->
        try
          result = JSON.parse(data)
          if result.error
            callback(new Error(result.error), null)
          else
            text = result.message?.content or ''
            callback(null, text)
        catch e
          callback(e, null)
      )
    )

    req.on('error', (e) -> callback(e, null))
    req.write(body)
    req.end()

module.exports = OllamaProvider
