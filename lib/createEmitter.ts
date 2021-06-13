export function createEmitter () {
  let events = {}

  // TODO could improve these types
  function emit (ev: string, ...args: any[]): void {
    events[ev] ? events[ev].map(fn => fn(...args)) : []
  }

  function on (ev: string, fn: (...args: any[]) => void) {
    events[ev] = events[ev] ? events[ev].concat(fn) : [fn]
    return () => events[ev].splice(events[ev].indexOf(fn), 1)
  }

  function clear () {
    events = {}
  }

  function listeners (ev: string) {
    return events[ev] || []
  }

  return {
    emit,
    on,
    clear,
    listeners
  }
}
