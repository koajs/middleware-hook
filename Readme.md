
# koa-middleware-hook

low-level hooks for your middleware. this is mostly an experiment,
but it lets you hook into the following spots:

  1. Downstream: Beginning of the middleware
  2. Downstream: Before yielding to the next middleware in the stack
  3. Upstream: Beginning on the way back up the stack
  4. Upstream: When the middleware finishs

useful for profiling your middleware, logging your middleware, timing your middleware, etc.

probably not suitable for production, though I haven't profiled it or anything.

## Install

```
npm install koa-middleware-hook
```

## Usage

##### `hook = Hook(function: marker, function: reduce)`

`marker` is a function called during each point in time where you'd return what you want to track. Here's an example:

```js
function marker () {
  return new Date()
}
```

`reduce` takes all 4 hooks and allows you to merge them together in some meaningful way. Something to keep in mind is that the innermost middleware will only execute 2 hooks:

```js
function reduce (middleware_name, downstream_start, downstream_end | upstream_end, upstream_start | null, upstream_end | null) {
  if (arguments.length === 3) {
    debug('%s: %sms', middleware_name, downstream_end - downstream_start)
  } else {
    debug('%s: %sms', middleware_name, (downstream_end - downstream_start) + (upstream_end - upstream_start))
  }
}
```

Here's how you use hook:

```
app.use(hook(bodyparser()))
```

## TODO

- solicit ideas for a better API
- some more usage examples

## License

MIT
