/**
 * Module Dependencies
 */

var compose = require('koa-compose')
var debug = require('debug')

/**
 * Export `statistics`
 */

module.exports = Statistics

/**
 * Initialize the statistics
 *
 * @param {Function} marker
 * @param {Function} reduce
 * @return {Function}
 */

function Statistics (marker, reduce) {

  return function statistics (generator) {
    var name = generator.name || 'middleware'
    return compose([ tracer, generator ])

    function * tracer (next) {
      var stats = this.state.statistics = this.state.statistics || {}
      var start = marker()

      // diff with the previous start
      if (stats.upper) {
        stats.upper_diff.push([ stats.upper[ stats.upper.length - 1 ], start ])
        stats.upper.push(start)
      } else {
        // start of last composed function, diff with end of last composed function
        stats.upper = [start]
        stats.upper_diff = []
      }

      // go through the remaining middleware
      yield next

      var end = marker()

      // diff the previous end
      if (stats.lower) {
        stats.lower_diff.push([ stats.lower[stats.lower.length - 1], end ])
        var beg = stats.upper_diff.pop()
        var fin = stats.lower_diff.shift()
        reduce(name, beg[0], beg[1], fin[0], fin[1])
      } else {
        // end of last composed function, diff with start of last composed function
        stats.lower = [end]
        stats.lower_diff = []
        reduce(name, start, end)
      }
    }
  }
}
