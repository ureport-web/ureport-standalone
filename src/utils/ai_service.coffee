SYSTEM_PROMPT = "You are a test failure analyst. Respond with valid JSON only. No markdown, no explanation outside the JSON."

buildUserMessage = (testData, historyTests, investigatedTests) ->
  lines = []

  lines.push("Test name: " + (testData.name or testData.uid or 'Unknown'))
  if testData.file
    lines.push("Test file: " + testData.file)
  lines.push("")

  if testData.failure
    if testData.failure.error_message
      lines.push("Error message:")
      lines.push(testData.failure.error_message)
      lines.push("")

    if testData.failure.stack_trace
      stackLines = testData.failure.stack_trace.split('\n').slice(0, 30)
      lines.push("Stack trace (first 30 lines):")
      lines.push(stackLines.join('\n'))
      lines.push("")

  # Steps around last failure
  allSteps = []
  if testData.setup and Array.isArray(testData.setup)
    allSteps = allSteps.concat(testData.setup)
  if testData.body and Array.isArray(testData.body)
    allSteps = allSteps.concat(testData.body)
  if testData.teardown and Array.isArray(testData.teardown)
    allSteps = allSteps.concat(testData.teardown)

  lastFailIdx = -1
  for step, i in allSteps
    if step.status and step.status.toUpperCase() is 'FAIL'
      lastFailIdx = i

  if lastFailIdx isnt -1
    windowStart = Math.max(0, lastFailIdx - 5)
    windowEnd = Math.min(allSteps.length - 1, lastFailIdx + 3)
    windowSteps = allSteps[windowStart..windowEnd]
    lines.push("Steps around failure (steps #{windowStart + 1}–#{windowEnd + 1} of #{allSteps.length}):")
    for step in windowSteps
      status = if step.status then step.status.toUpperCase() else 'UNKNOWN'
      detail = (step.detail or '').replace(/\s*\n\s*/g, ' ').substring(0, 200)
      lines.push("  [#{status}] #{detail}")
    lines.push("")

  # Run history
  if historyTests and historyTests.length > 0
    lines.push("Run history (most recent first):")
    for t in historyTests
      statusLine = "  " + (t.status or 'UNKNOWN')
      if t.failure and t.failure.error_message
        statusLine += ": " + t.failure.error_message.substring(0, 250)
      lines.push(statusLine)
    lines.push("")

  # Prior human-investigated causes
  if investigatedTests and investigatedTests.length > 0
    lines.push("Prior human-classified causes for this test:")
    for inv in investigatedTests
      if inv.caused_by
        lines.push("  - " + inv.caused_by)
    lines.push("")

  lines.push("Based on the above, respond with a JSON object with these fields:")
  lines.push('{"root_cause_category": "Code Defect | Test Flakiness | Environment Issue | Configuration Error | Test Data Issue | Infrastructure Issue", "confidence": 0-100, "what_failed": "specific assertion, selector, API call, or step that failed", "why_it_failed": "root cause reasoning referencing the error/stack/steps", "fix": "concrete actionable fix (not generic)", "flakiness_signal": "consistent | intermittent | regression | new", "related_patterns": ["pattern1", "pattern2"]}')

  return lines.join('\n')

logger = require('./logger')

analyzeTestFailure = (provider, testData, historyTests, investigatedTests, callback) ->
  userMessage = buildUserMessage(testData, historyTests, investigatedTests)
  logger.debug('[AI] Sending prompt payload:')
  logger.debug('[AI] SYSTEM:', SYSTEM_PROMPT)
  logger.debug('[AI] USER MESSAGE:\n' + userMessage)
  provider.chat(SYSTEM_PROMPT, userMessage, (err, text) ->
    if err
      return callback(err, null)
    try
      # Strip markdown code fences if present
      clean = text.trim()
      clean = clean.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '')
      result = JSON.parse(clean)
      callback(null, result)
    catch e
      callback(new Error('AI response is not valid JSON: ' + text), null)
  )

module.exports = { analyzeTestFailure }
