chai   = require('chai')
should = chai.should()
{ matchForLanes } = require('../../src/utils/latest_status_query')

lane = (product, type, extra = []) ->
  { $and: [{ is_archive: false }, { product: product }, { type: type }].concat(extra) }

describe 'latest_status_query.matchForLanes', ->

  it 'turns the full product x type cross product into $in', ->
    query = [lane('A', 'ui'), lane('A', 'api'), lane('B', 'ui'), lane('B', 'api')]
    match = matchForLanes(query)
    match.should.not.have.property '$or'
    match.$and.should.deep.include { is_archive: false }
    match.$and.should.deep.include { product: { $in: ['A', 'B'] } }
    match.$and.should.deep.include { type: { $in: ['ui', 'api'] } }

  it 'keeps the $or when the pairs are not the full cross product', ->
    query = [lane('A', 'ui'), lane('B', 'api')]
    matchForLanes(query).should.deep.equal { $or: query }

  it 'keeps the $or when one pair is missing from the cross product', ->
    query = [lane('A', 'ui'), lane('A', 'api'), lane('B', 'ui')]
    matchForLanes(query).should.deep.equal { $or: query }

  it 'keeps the $or when the other conditions differ between clauses', ->
    query = [lane('A', 'ui', [{ team: 'x' }]), lane('A', 'api', [{ team: 'y' }])]
    matchForLanes(query).should.deep.equal { $or: query }

  it 'keeps the other conditions when they are the same everywhere', ->
    query = [lane('A', 'ui', [{ team: 'x' }]), lane('B', 'ui', [{ team: 'x' }])]
    match = matchForLanes(query)
    match.$and.should.deep.include { team: 'x' }
    match.$and.should.deep.include { product: { $in: ['A', 'B'] } }

  it 'keeps the $or for a product or type that is not a plain string', ->
    query = [lane('A', 'ui'), { $and: [{ is_archive: false }, { product: { $in: ['B'] } }, { type: 'ui' }] }]
    matchForLanes(query).should.deep.equal { $or: query }

  it 'keeps the $or for a single clause and for odd shapes', ->
    one = [lane('A', 'ui')]
    matchForLanes(one).should.deep.equal { $or: one }
    odd = [{ product: 'A' }, { product: 'B' }]
    matchForLanes(odd).should.deep.equal { $or: odd }
    matchForLanes([]).should.deep.equal { $or: [] }

  it 'counts a repeated pair once', ->
    query = [lane('A', 'ui'), lane('A', 'ui'), lane('A', 'api'), lane('B', 'ui'), lane('B', 'api')]
    matchForLanes(query).$and.should.deep.include { product: { $in: ['A', 'B'] } }
