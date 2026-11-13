# Builds the Mongo match for POST /build/status/latest.
#
# The client sends one condition per lane filter, combined with $or. The Product Lanes page sends every
# product x type pair, hundreds of clauses most of which match nothing. When the pairs are exactly the
# full cross product of their products and types (and everything else in the clauses is identical),
# the same builds are matched by `product $in` and `type $in`, which the planner handles far better.
# Any other shape is left as the plain $or, so a result never changes.

# [{ product: 'P' }, { type: 'T' }, ...] -> { product: 'P', type: 'T', rest: [...] }, or null if the
# clause is not made of single-key terms with a plain string product and type.
splitClause = (clause) ->
  terms = clause?.$and
  return null unless Array.isArray(terms) and terms.length > 0
  parts = { product: null, type: null, rest: [] }
  for term in terms
    return null unless term and typeof term is 'object' and Object.keys(term).length is 1
    key = Object.keys(term)[0]
    if key is 'product' or key is 'type'
      return null unless typeof term[key] is 'string' and parts[key] is null
      parts[key] = term[key]
    else
      parts.rest.push term
  return null unless parts.product? and parts.type?
  parts

matchForLanes = (query) ->
  orMatch = { $or: query }
  return orMatch unless Array.isArray(query) and query.length > 1

  clauses = []
  for clause in query
    parts = splitClause(clause)
    return orMatch unless parts
    clauses.push parts

  restKey = (p) -> JSON.stringify(p.rest)
  firstRest = restKey(clauses[0])
  return orMatch unless clauses.every (p) -> restKey(p) is firstRest

  pairs = {}
  products = {}
  types = {}
  for p in clauses
    pairs["#{p.product}\u0000#{p.type}"] = true
    products[p.product] = true
    types[p.type] = true
  productList = Object.keys(products)
  typeList = Object.keys(types)
  return orMatch unless Object.keys(pairs).length is productList.length * typeList.length

  { $and: clauses[0].rest.concat([{ product: { $in: productList } }, { type: { $in: typeList } }]) }

module.exports = { matchForLanes }
