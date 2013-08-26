var Emitter = require('emitter-component')
var objectKeys = require('object-keys')

module.exports = axes
module.exports.def = axis

function axes() {
  var root = new Emitter
  root.children = {}

  root.def = def
  function def(name, child) {
    child = child || axis()
    child.def = def
    child.fork = fork
    child.alias = _alias
    child.root = getSelf

    if (name) {
      root[name] = child
      root.children[name] = child
      child.on('update', function(key) {
        root.emit('update', key, name)
      })
    }

    return child
  }

  root.fork = fork
  function fork(name, orig) {
    var child = root[name] = root[orig].copy()
    return child.on('update', function(key) {
      root.emit('update', key, name)
    })
  }

  root.alias = _alias
  function _alias(mapper) {
    var alias = axes()

    objectKeys(root.children).forEach(function(key) {
      alias.def(mapper[key], root.children[key])
    })

    return alias
  }

  root.copy = _copy
  function _copy() {
    var copy = axes()

    objectKeys(root.children).forEach(function(key) {
      copy.def(key, root.children[key].copy())
    })

    return copy
  }

  function getSelf() {
    return root
  }

  return root
}

function axis() {
  var root = Emitter(scale)
  var da = 0, db = 1
  var ra = 0, rb = 1

  function scale(x) {
    return ra + rb * ((x - da) / db)
  }

  root.invert = invert
  function invert(x) {
    return da + db * ((x - ra) / rb)
  }

  function rescale() {
    da = domain[0]
    db = domain[1] - domain[0]
    ra = range[0]
    rb = range[1] - range[0]
  }

  root.map = _map
  function _map(fn) {
    return function(n) {
      return fn(scale(n))
    }
  }

  var domain = [0, 1]
  root.domain = _domain
  function _domain(arr) {
    if (!arguments.length) return domain
    domain = arr
    rescale()
    root.emit('update', 'domain')
    return root
  }

  var range = [0, 1]
  root.range = _range
  function _range(arr) {
    if (!arguments.length) return range
    range = arr
    rescale()
    root.emit('update', 'range')
    return root
  }

  root.copy = _copy
  function _copy(name) {
    return root.def(null)
      .domain([da, da+db])
      .range([ra, ra+rb])
  }

  return root
}

function identity(x) {
  return x
}
