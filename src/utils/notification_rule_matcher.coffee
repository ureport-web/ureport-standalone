# Pure matching logic for notification rules — no DB, no HTTP.
# Extracted from src/routes/build.coffee so it can be unit-tested directly.

# checkRelation(cond, tr)
# cond: { type: String, values: [String] }
# tr:   TestRelation document (or plain object with same shape)
# Returns true if tr satisfies cond.
checkRelation = (cond, tr) ->
  vals = cond.values or []
  switch cond.type
    when 'tags'
      tagsArr = if Array.isArray(tr.tags) then tr.tags else (if tr.tags then [tr.tags] else [])
      vals.some((v) -> tagsArr.some (t) -> if typeof t == 'string' then t == v else t.name == v)
    when 'teams'
      teamsArr = if Array.isArray(tr.teams) then tr.teams else (if tr.teams then [tr.teams] else [])
      vals.some((v) -> teamsArr.some (t) -> if typeof t == 'string' then t == v else t.name == v)
    when 'components'
      comps = tr.components or []
      compsArr = if Array.isArray(comps) then comps else [comps]
      vals.some((v) -> compsArr.some (c) -> if typeof c == 'string' then c == v else c.name == v)
    else
      custom = (tr.customs or {})[cond.type]
      if Array.isArray(custom) then vals.some((v) -> custom.includes(v))
      else vals.includes(custom)

# matchesRule(rule, allRelations)
# rule.filter.relations: [cond]
# rule.filter.logic:     'AND' | 'OR'  (default 'AND')
# Returns the subset of allRelations that satisfy the rule's relation conditions.
# When relations is empty, returns all relations unchanged.
matchesRule = (rule, allRelations) ->
  filter    = rule.filter or {}
  relations = filter.relations or []
  logic     = filter.logic or 'AND'

  return allRelations if relations.length == 0

  allRelations.filter (tr) ->
    if logic == 'OR'
      relations.some  (cond) -> checkRelation(cond, tr)
    else
      relations.every (cond) -> checkRelation(cond, tr)

module.exports = { checkRelation, matchesRule }
