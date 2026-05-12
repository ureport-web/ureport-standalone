crypto = require('crypto')
https = require('https')

SIGNING_SERVICE = 'bedrock'
ENDPOINT_PREFIX = 'bedrock-runtime'

sha256hex = (data) ->
  crypto.createHash('sha256').update(data, 'utf8').digest('hex')

hmacSHA256 = (key, data) ->
  crypto.createHmac('sha256', key).update(data, 'utf8').digest()

# SigV4 canonical URI encoding: encode every byte except unreserved chars.
# Applied to the already-percent-encoded path, so % itself becomes %25,
# turning %3A into %253A as AWS expects.
sigV4EncodePath = (encodedPath) ->
  encodedPath.split('/').map((segment) ->
    segment.split('').map((c) ->
      if /[A-Za-z0-9\-_.~]/.test(c) then c
      else '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')
    ).join('')
  ).join('/')

getSigningKey = (secretKey, dateStamp, region) ->
  kDate = hmacSHA256('AWS4' + secretKey, dateStamp)
  kRegion = hmacSHA256(kDate, region)
  kService = hmacSHA256(kRegion, SIGNING_SERVICE)
  hmacSHA256(kService, 'aws4_request')

class BedrockProvider
  constructor: (accessKeyId, secretAccessKey, sessionToken, region, model) ->
    @accessKeyId = accessKeyId
    @secretAccessKey = secretAccessKey
    @sessionToken = sessionToken or ''
    @region = region or 'us-east-1'
    @model = model or 'us.anthropic.claude-sonnet-4-5-20250929-v1:0'

  chat: (systemPrompt, userMessage, callback) ->
    body = JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31'
      max_tokens: 1024
      system: systemPrompt
      messages: [{ role: 'user', content: userMessage }]
    })

    now = new Date()
    # Format: 20250929T120000Z
    amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '').slice(0, 15) + 'Z'
    dateStamp = amzDate.slice(0, 8)

    # Encode model ID for path — encodeURIComponent handles colons as %3A
    encodedModel = encodeURIComponent(@model)
    path = '/model/' + encodedModel + '/invoke'
    host = ENDPOINT_PREFIX + '.' + @region + '.amazonaws.com'

    payloadHash = sha256hex(body)

    # Canonical headers must be lowercase and sorted
    canonicalHeadersMap = {
      'content-type': 'application/json'
      'host': host
      'x-amz-date': amzDate
    }
    if @sessionToken
      canonicalHeadersMap['x-amz-security-token'] = @sessionToken

    signedHeaderNames = Object.keys(canonicalHeadersMap).sort()
    canonicalHeaders = signedHeaderNames.map((k) -> k + ':' + canonicalHeadersMap[k]).join('\n') + '\n'
    signedHeaders = signedHeaderNames.join(';')

    canonicalRequest = [
      'POST'
      sigV4EncodePath(path)
      ''
      canonicalHeaders
      signedHeaders
      payloadHash
    ].join('\n')

    credentialScope = dateStamp + '/' + @region + '/' + SIGNING_SERVICE + '/aws4_request'
    stringToSign = [
      'AWS4-HMAC-SHA256'
      amzDate
      credentialScope
      sha256hex(canonicalRequest)
    ].join('\n')

    signingKey = getSigningKey(@secretAccessKey, dateStamp, @region)
    signature = crypto.createHmac('sha256', signingKey).update(stringToSign, 'utf8').digest('hex')

    authHeader = 'AWS4-HMAC-SHA256 Credential=' + @accessKeyId + '/' + credentialScope +
      ', SignedHeaders=' + signedHeaders +
      ', Signature=' + signature

    reqHeaders = {
      'Content-Type': 'application/json'
      'Content-Length': Buffer.byteLength(body)
      'Host': host
      'X-Amz-Date': amzDate
      'Authorization': authHeader
    }
    if @sessionToken
      reqHeaders['X-Amz-Security-Token'] = @sessionToken

    options = {
      hostname: host
      port: 443
      path: path
      method: 'POST'
      headers: reqHeaders
    }

    req = https.request(options, (res) ->
      data = ''
      res.on('data', (chunk) -> data += chunk)
      res.on('end', ->
        try
          result = JSON.parse(data)
          if result.message  # Bedrock error envelope
            callback(new Error(result.message), null)
          else
            text = result.content?[0]?.text or ''
            callback(null, text)
        catch e
          callback(e, null)
      )
    )

    req.on('error', (e) -> callback(e, null))
    req.write(body)
    req.end()

module.exports = BedrockProvider
