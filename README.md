# axes [![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

An alternative to d3's
[quantitative scales](https://github.com/mbostock/d3/wiki/Quantitative-Scales)
that handles multiple axes a little more conveniently.

I've found that in larger d3 projects I tend to create a few duplicate scales
across multiple charts, when really they'd be easier to manage/update them as a
group: being passed around into each chart as required, responding to updates
being made in other parts of the code.

## Installation ##

``` bash
$ npm install --save axes
```


## Example ##

``` javascript
var linedata = require('./linedata.json')
var bardata = require('./bardata.json')
var d3 = require('d3')

var axes = require('axes')()
  .def('barX')
    .domain([0, bardata.length])
  .def('barY')
    .domain([0, d3.max(bardata)])
  .def('lineX')
    .domain([0, linedata.length])
  .def('lineY')
    .domain([0, d3.max(linedata)])
  .root()

// Alias your scales so they play nice
// with the code you're giving it.
axes.barX(2) // 0.5
axes.alias({ x: 'barX' }).x(2) // 0.5

// Throw them into your charts
require('./barchart')({
  axes: axes.alias({
      x: 'barX'
    , y: 'barY'
  })
})
require('./linechart')({
  axes: axes.alias({
      x: 'lineX'
    , x: 'lineY'
  })
})

// Use `axis.map` for alternative value
// mappings.
var angle = axes.barX.map(function(n) {
  return n.value * Math.PI * 2
})

angle({ value: 2 }) // 3.14159265...
```


## API ##

### `axis = require('axes').def()` ###

Returns an anonymous scale, which is very similar to `d3.scale.linear`, but a
more limited API.

### `axis.domain([domain])` ###

Takes an 2-element array defining the minimum and maximum *input* values for
the scale.

### `axis.range([range])` ###

Takes an 2-element array defining the minimum and maximum *output* values for
the scale.

### `axis()` ###

Returns a number between `range[0]` and `range[1]` depending on how far it is
between `domain[0]` and `domain[1]`.

### `axis.on('update', handler(key))` ###

The "update" event is called on `handler` every time the axis' `range` or
`domain` properties are updated.

### `axis.copy()` ###

Creates a copy of the axis, so that you can change its `domain` and `range`
values without altering the original one.

### `scale = axis.map([map])` ###

Returns a scale that maps its output according to `map`. The initial value will
be scaled based on `axis`'s output. You can update these values in the
original scale and the scale's range will update accordingly too.

### `scale()` ###

The returned scale essentially boils down to:

``` javascript
axis().map(mapper)(n) === mapper(axis(n))
```

### `axes = require('axes')()` ###

Returns a new group of axes.

### `member = axes.def(name)` ###

Returns a named scale, attached to this group.

### `member.root()` ###

Returns the group of axes.

### `member[fork|alias|def]()` ###

The `fork`, `alias` and `def` methods on each group member will be called from
the group, to make for easier chaining.

### `axes.fork(new, old)` ###

Creates a copy of the group's member called `old`, called `new`.

### `axes.alias(map)` ###

Returns a copy of the group, while preserving the original references to each
member. `map` is an object: the keys determine the new name, and the values
determine the old one.

``` javascript
var axes = require('axes')()
  .def('oldX')
  .range([0, 100])

var aliased = axes.alias({
  oldX: 'newX'
})

axes.oldX(0.5)    // 50
aliased.newX(0.5) // 50
aliased.oldX(0.5) // Object #<Object> has no method 'oldX'
```

### `axes.copy()` ###

Copies the whole group, copying each member reference as well so you can make
can changes to this copy without having to worry about altering the other
scales.
