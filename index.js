/**
 * Module Dependencies
 */

var compose = require('koa-compose')
var debug = require('debug')

/**
 * Export `hooks`
 */

module.exports = Hooks

/**
 * Initialize the hooks
 *
 * @param {Function} marker
 * @param {Function} reduce
 * @return {Function}
 */

function Hooks (marker, reduce) {

  return function hooks (generator) {
    var name = generator.name || 'middleware'
    return compose([ tracer, generator ])

    function * tracer (next) {
      var hooks = this.state.hooks = this.state.hooks || {}
      var start = marker()

      // diff with the previous start
      if (hooks.upper) {
        hooks.upper_diff.push([ hooks.upper[ hooks.upper.length - 1 ], start ])
        hooks.upper.push(start)
      } else {
        // start of last composed function, diff with end of last composed function
        hooks.upper = [start]
        hooks.upper_diff = []
      }

      // go through the remaining middleware
      yield next

      var end = marker()

      // diff the previous end
      if (hooks.lower) {
        var beg = hooks.upper_diff.pop()
        var fin = [ hooks.lower[hooks.lower.length - 1], end ]
        reduce(name, beg[0], beg[1], fin[0], fin[1])
        hooks.lower.push(end)
      } else {
        // end of last composed function, diff with start of last composed function
        hooks.lower = [end]
        reduce(name, start, end)
      }
    }
  }
}
