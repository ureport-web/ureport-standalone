BedrockProvider = require('./ai_providers/bedrock_provider')
ClaudeProvider = require('./ai_providers/claude_provider')
OpenAIProvider = require('./ai_providers/openai_provider')
OllamaProvider = require('./ai_providers/ollama_provider')
GeminiProvider = require('./ai_providers/gemini_provider')
SystemSetting = require('../models/system_setting')

getProvider = (callback) ->
  SystemSetting.findOne({ name: 'SYSTEM_SETTING' }).exec((err, setting) ->
    if err or not setting
      return callback(null, null)

    ai = setting.ai
    if not ai or not ai.provider
      return callback(null, null)

    provider = ai.provider
    apiKey = ai.api_key or ''
    baseUrl = ai.base_url or ''
    model = ai.model or ''

    switch provider
      when 'bedrock'
        callback(null, new BedrockProvider(ai.aws_access_key_id, ai.aws_secret_access_key, ai.aws_session_token, ai.aws_region, model or 'us.anthropic.claude-sonnet-4-5-20250929-v1:0'), provider, model or 'us.anthropic.claude-sonnet-4-5-20250929-v1:0')
      when 'claude'
        callback(null, new ClaudeProvider(apiKey, model), provider, model or 'claude-haiku-4-5-20251001')
      when 'openai'
        callback(null, new OpenAIProvider(apiKey, model, baseUrl), provider, model or 'gpt-4o-mini')
      when 'ollama'
        callback(null, new OllamaProvider(model, baseUrl), provider, model or 'llama3.2')
      when 'gemini'
        callback(null, new GeminiProvider(apiKey, model), provider, model or 'gemini-2.0-flash')
      else
        callback(null, null)
  )

module.exports = { getProvider }
