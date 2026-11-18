chai = require('chai')
chai.should()
{ periodFromQuery, tzOffsetFromQuery, exceedsCommunityPeriod, ms, percentile, durationStats, bucketSeries, DAY_MS } = require('../../src/utils/insights_math')

describe 'insights math', ->

  describe 'periodFromQuery', ->
    now = new Date('2026-03-10T12:00:00Z')

    it 'defaults to the week before now', ->
      p = periodFromQuery({}, now)
      p.until.getTime().should.equal now.getTime()
      (p.until.getTime() - p.since.getTime()).should.equal 7 * DAY_MS

    it 'reads since and until', ->
      p = periodFromQuery({ since: '2026-03-01', until: '2026-03-05' }, now)
      p.since.toISOString().should.equal '2026-03-01T00:00:00.000Z'
      p.until.toISOString().should.equal '2026-03-05T00:00:00.000Z'

    it 'treats an unreadable date as missing', ->
      p = periodFromQuery({ since: 'garbage', until: 'nope' }, now)
      (p.until.getTime() - p.since.getTime()).should.equal 7 * DAY_MS

  describe 'tzOffsetFromQuery', ->
    it 'reads minutes and refuses what is not sensible', ->
      tzOffsetFromQuery({ tz_offset: '-120' }).should.equal -120
      tzOffsetFromQuery({}).should.equal 0
      tzOffsetFromQuery({ tz_offset: 'abc' }).should.equal 0
      tzOffsetFromQuery({ tz_offset: '99999' }).should.equal 0

  describe 'exceedsCommunityPeriod', ->
    since = new Date('2026-03-01T00:00:00Z')
    it 'allows up to 31 days and refuses more', ->
      exceedsCommunityPeriod(since, new Date(since.getTime() + 7 * DAY_MS)).should.equal false
      exceedsCommunityPeriod(since, new Date(since.getTime() + 31 * DAY_MS)).should.equal false
      exceedsCommunityPeriod(since, new Date(since.getTime() + 31 * DAY_MS + 1)).should.equal true
      exceedsCommunityPeriod(since, new Date(since.getTime() + 90 * DAY_MS)).should.equal true

  describe 'ms', ->
    it 'is the time between two dates, and null when one is missing or the order is wrong', ->
      ms('2026-03-01T00:00:00Z', '2026-03-01T00:05:00Z').should.equal 300000
      (ms(null, '2026-03-01T00:05:00Z') is null).should.equal true
      (ms('2026-03-01T00:05:00Z', '2026-03-01T00:00:00Z') is null).should.equal true

  describe 'percentile and durationStats', ->
    it 'uses the nearest rank and is null for no values', ->
      (percentile([], 50) is null).should.equal true
      percentile([5], 90).should.equal 5
      percentile([10, 20, 30, 40], 50).should.equal 20
      percentile([40, 10, 30, 20], 90).should.equal 40

    it 'reports the count, median and 90th percentile', ->
      durationStats([10, 20, 30, 40]).should.eql { count: 4, medianMs: 20, p90Ms: 40 }
      durationStats([]).should.eql { count: 0, medianMs: null, p90Ms: null }

  describe 'bucketSeries', ->
    at = (iso) -> new Date("#{iso}T12:00:00Z")
    keys = ['a', 'b']

    it 'has one bucket per day, empty days included, counted under each key', ->
      s = bucketSeries(
        [{ date: at('2026-03-02'), key: 'a' }, { date: at('2026-03-02'), key: 'b' }, { date: at('2026-03-04'), key: 'a' }],
        { since: new Date('2026-03-01T00:00:00Z'), until: new Date('2026-03-05T23:59:59Z'), keys: keys }
      )
      s.granularity.should.equal 'day'
      s.buckets.map((b) -> b.start).should.eql ['2026-03-01', '2026-03-02', '2026-03-03', '2026-03-04', '2026-03-05']
      s.buckets.map((b) -> b.total).should.eql [0, 2, 0, 1, 0]
      s.buckets[1].outcomes.should.eql { a: 1, b: 1 }

    it 'follows the viewer time zone, not UTC', ->
      late = { date: new Date('2026-03-02T23:30:00Z'), key: 'a' }
      opts = { since: new Date('2026-03-01T00:00:00Z'), until: new Date('2026-03-04T00:00:00Z'), keys: keys }
      utc = bucketSeries([late], Object.assign({}, opts, { tzOffsetMin: 0 })).buckets
      utc.filter((b) -> b.start is '2026-03-02')[0].total.should.equal 1
      east = bucketSeries([late], Object.assign({}, opts, { tzOffsetMin: -120 })).buckets
      east.filter((b) -> b.start is '2026-03-03')[0].total.should.equal 1
      east.filter((b) -> b.start is '2026-03-02')[0].total.should.equal 0

    it 'goes weekly past 35 days', ->
      s = bucketSeries([{ date: at('2026-01-02'), key: 'a' }, { date: at('2026-03-20'), key: 'a' }],
        { since: new Date('2026-01-01T00:00:00Z'), until: new Date('2026-03-31T23:59:59Z'), keys: keys })
      s.granularity.should.equal 'week'
      s.buckets.length.should.equal 13
      s.buckets[0].start.should.equal '2026-01-01'
      s.buckets.reduce(((n, b) -> n + b.total), 0).should.equal 2

    it 'ignores an event outside the period', ->
      s = bucketSeries([{ date: at('2026-02-01'), key: 'a' }, { date: at('2026-04-01'), key: 'a' }],
        { since: new Date('2026-03-01T00:00:00Z'), until: new Date('2026-03-03T23:59:59Z'), keys: keys })
      s.buckets.reduce(((n, b) -> n + b.total), 0).should.equal 0
