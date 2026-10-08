/**
 * Escapes all special regex metacharacters in a string for safe literal matching.
 * Use when user input should be treated as a literal value inside a $regex query.
 */
function escapeRegex(str) {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Validates a user-supplied regex string. Returns the string if valid, null if it throws.
 * Use when user intentionally provides a regex pattern (e.g. with ^ / $ anchors).
 */
function safeRegex(str) {
  try {
    new RegExp(str);
    return str;
  } catch (e) {
    return null;
  }
}

module.exports = { escapeRegex, safeRegex };
