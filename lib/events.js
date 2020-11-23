let events = {}

export function emit (ev, ...args) {
  return events[ev] ? events[ev].map(fn => fn(...args)) : []
}

export function on (ev, fn) {
  events[ev] = events[ev] ? events[ev].concat(fn) : [fn]
  return () => events[ev].slice(events[ev].indexOf(fn), 1)
}

export function clear () {
  events = {}
}

export function listeners (ev) {
  return events[ev] || []
}
