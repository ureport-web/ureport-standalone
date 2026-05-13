https = require('https')
http = require('http')
url = require('url')

class OpenAIProvider
  constructor: (apiKey, model, baseUrl) ->
    @apiKey = apiKey
    @model = model or 'gpt-4o-mini'
    @baseUrl = baseUrl or 'https://api.openai.com'

  chat: (systemPrompt, userMessage, callback) ->
    body = JSON.stringify({
      model: @model
      messages: [
        { role: 'system', content: systemPrompt }
        { role: 'user', content: userMessage }
      ]
      max_tokens: 1024
    })

    parsed = url.parse(@baseUrl)
    isHttps = parsed.protocol is 'https:'
    transport = if isHttps then https else http
    port = if parsed.port then parseInt(parsed.port) else (if isHttps then 443 else 80)

    options = {
      hostname: parsed.hostname
      port: port
      path: '/v1/chat/completions'
      method: 'POST'
      headers: {
        'Content-Type': 'application/json'
        'Content-Length': Buffer.byteLength(body)
        'Authorization': 'Bearer ' + @apiKey
      }
    }

    req = transport.request(options, (res) ->
      data = ''
      res.on('data', (chunk) -> data += chunk)
      res.on('end', ->
        try
          result = JSON.parse(data)
          if result.error
            callback(new Error(result.error.message), null)
          else
            text = result.choices?[0]?.message?.content or ''
            callback(null, text)
        catch e
          callback(e, null)
      )
    )

    req.on('error', (e) -> callback(e, null))
    req.write(body)
    req.end()

module.exports = OpenAIProvider
