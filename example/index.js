/**
 * Module Dependencies
 */

var Statistics = require('../')
var bytes = require('bytes')
var roo = require('roo')()
var ms = require('ms')

var stats = Statistics(marker, reduce)

// things to track
function marker () {
  return {
    time: new Date(),
    memory: process.memoryUsage().rss
  }
}

// Note: I don't actually think i'm doing memory right here,
// since sometimes it's negative :-P
function reduce (name, a, b, c, d) {
  if (c && d) {
    var memory = (b.memory - a.memory) + (d.memory - c.memory)
    var time = (b.time - a.time) + (d.time - c.time)
  } else {
    var memory = b.memory - a.memory
    var time = b.time - a.time
  }
  console.log('%s - time: %s memory: %s', name, ms(time), bytes(memory));
}

roo.use(stats(function * find_user (next) {
  yield wait(3500)
  yield next
  yield wait(500)
}))

roo.get('/', stats(function * render () {
  yield wait(1000)
  this.body = 'hi there!'
  yield wait(2000)
}))

function wait (ms) {
  return function (done) {
    setTimeout(done, ms)
  }
}

roo.listen(5000, function() {
  var addr = this.address()
  console.log('listening on [%s]:%s', addr.address, addr.port);
})
