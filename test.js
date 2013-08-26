var test = require('tape')
var axes = require('./axes')

test('101', function(t) {
  t.equal(axes()
    .def('x')
    .domain([0, 5])
    .range([0, 100])(2.5)
  , 50)
  t.end()
})

test('non-zero bases', function(t) {
  t.equal(axes()
    .def('x')
    .domain([1, 2])
    .range([50, 100])(1.5)
  , 75)
  t.end()
})

test('invert', function(t) {
  t.equal(axes()
    .def('x')
    .domain([1, 2])
    .range([50, 100]).invert(75)
  , 1.5)
  t.end()
})

test('map', function(t) {
  t.equal(axes()
    .def('x')
    .domain([1, 2])
    .range([50, 100])
    .map(function(n) {
      return -n
    })(1.5)
  , -75)

  t.end()
})

test('alias', function(t) {
  t.plan(10)

  var aa = axes().def('x').root()

  t.ok(aa.x)
  t.deepEqual(aa.x(100), 100)

  aa.on('update', function(key, name) {
    t.equal(key, 'range')
    t.equal(name, 'x')
  })

  var bb = aa.alias({ x: 'y' })

  bb.on('update', function(key, name) {
    t.equal(key, 'range')
    t.equal(name, 'y')
  })

  t.ok(bb.y)
  t.deepEqual(bb.y(100), 100)

  bb.y.range([0, 2])

  t.deepEqual(bb.y(100), 200)
  t.deepEqual(aa.x(100), 200)
})

test('alias', function(t) {
  t.plan(8)

  var aa = axes().def('x').root()

  t.ok(aa.x)
  t.deepEqual(aa.x(100), 100)

  aa.on('update', function(key, name) {
    throw new Error('Event called when it should not')
  })

  var bb = aa.copy()

  bb.on('update', function(key, name) {
    t.equal(key, 'range')
    t.equal(name, 'x')
  })

  t.ok(bb.x)
  t.deepEqual(bb.x(100), 100)

  bb.x.range([0, 2])

  t.deepEqual(bb.x(100), 200)
  t.deepEqual(aa.x(100), 100)
})
