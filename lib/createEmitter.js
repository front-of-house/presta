function createEmitter () {
  let events = {}

  function emit (ev, ...args) {
    return events[ev] ? events[ev].map(fn => fn(...args)) : []
  }

  function on (ev, fn) {
    events[ev] = events[ev] ? events[ev].concat(fn) : [fn]
    return () => events[ev].splice(events[ev].indexOf(fn), 1)
  }

  function clear () {
    events = {}
  }

  function listeners (ev) {
    return events[ev] || []
  }

  return {
    emit,
    on,
    clear,
    listeners
  }
}

module.exports = { createEmitter }
