{ BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime')

class BedrockProvider
  constructor: (region, model) ->
    @region = region or 'us-east-1'
    @model = model or 'us.anthropic.claude-sonnet-4-5-20250929-v1:0'
    @client = new BedrockRuntimeClient({ region: @region })

  chat: (systemPrompt, userMessage, callback) ->
    body = JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31'
      max_tokens: 1024
      system: systemPrompt
      messages: [{ role: 'user', content: userMessage }]
    })

    command = new InvokeModelCommand({
      modelId: @model
      contentType: 'application/json'
      accept: 'application/json'
      body: Buffer.from(body)
    })

    promise = @client.send(command)
    promise.then(
      (response) ->
        try
          text = Buffer.from(response.body).toString('utf8')
          result = JSON.parse(text)
          content = result.content?[0]?.text or ''
          callback(null, content)
        catch e
          callback(e, null)
    ).catch(
      (err) ->
        callback(err, null)
    )

module.exports = BedrockProvider
