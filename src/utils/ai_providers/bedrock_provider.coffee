{ BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime')
{ STSClient, AssumeRoleCommand } = require('@aws-sdk/client-sts')

class BedrockProvider
  constructor: (region, model, roleArn) ->
    @region = region or 'us-east-1'
    @model = model or 'us.anthropic.claude-sonnet-4-5-20250929-v1:0'
    @roleArn = roleArn or null
    @_client = null
    @_clientExpiry = null

  _getClient: (callback) ->
    if not @roleArn
      if not @_client
        @_client = new BedrockRuntimeClient({ region: @region })
      return callback(null, @_client)

    now = Date.now()
    if @_client and @_clientExpiry and now < @_clientExpiry
      return callback(null, @_client)

    stsClient = new STSClient({ region: @region })
    assumeCommand = new AssumeRoleCommand({
      RoleArn: @roleArn
      RoleSessionName: 'ureport-bedrock-session'
      DurationSeconds: 3600
    })

    promise = stsClient.send(assumeCommand)
    promise.then(
      (data) =>
        creds = data.Credentials
        @_client = new BedrockRuntimeClient({
          region: @region
          credentials: {
            accessKeyId: creds.AccessKeyId
            secretAccessKey: creds.SecretAccessKey
            sessionToken: creds.SessionToken
          }
        })
        @_clientExpiry = creds.Expiration.getTime() - 5 * 60 * 1000
        callback(null, @_client)
    ).catch(
      (err) ->
        callback(err, null)
    )

  chat: (systemPrompt, userMessage, callback) ->
    @_getClient((err, client) =>
      if err
        return callback(err, null)

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

      promise = client.send(command)
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
    )

module.exports = BedrockProvider
