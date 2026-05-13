https = require('https')

class GeminiProvider
  constructor: (apiKey, model) ->
    @apiKey = apiKey
    @model = model or 'gemini-2.0-flash'

  chat: (systemPrompt, userMessage, callback) ->
    body = JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      }
      contents: [
        {
          role: 'user'
          parts: [{ text: userMessage }]
        }
      ]
      generationConfig: {
        maxOutputTokens: 1024
      }
    })

    path = '/v1beta/models/' + @model + ':generateContent?key=' + @apiKey

    options = {
      hostname: 'generativelanguage.googleapis.com'
      port: 443
      path: path
      method: 'POST'
      headers: {
        'Content-Type': 'application/json'
        'Content-Length': Buffer.byteLength(body)
      }
    }

    req = https.request(options, (res) ->
      data = ''
      res.on('data', (chunk) -> data += chunk)
      res.on('end', ->
        try
          result = JSON.parse(data)
          if result.error
            callback(new Error(result.error.message), null)
          else
            text = result.candidates?[0]?.content?.parts?[0]?.text or ''
            callback(null, text)
        catch e
          callback(e, null)
      )
    )

    req.on('error', (e) -> callback(e, null))
    req.write(body)
    req.end()

module.exports = GeminiProvider
