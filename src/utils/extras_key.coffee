# Canonical string for a build's free-form `extras`: sorted `k=v` pairs joined by '|'.
# Falsy values are skipped. Used for build lane identity and quarantine scope.
extrasToKey = (extras) ->
  return '' unless extras and typeof extras is 'object'
  obj = if extras instanceof Map then Object.fromEntries(extras) else extras
  sorted = Object.keys(obj).sort().filter (k) -> obj[k]
  sorted.map((k) -> "#{k}=#{obj[k]}").join('|')

module.exports = { extrasToKey }
