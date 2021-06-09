export const createEmitter = () => {
  let events = []

  const emit =  (ev, ...args) => {
    return events[ev] ? events[ev].map(fn => fn(...args)) : []
  }

  const on =  (ev, fn) => {
    events[ev] = events[ev] ? events[ev].concat(fn) : [fn]
    return () => events[ev].splice(events[ev].indexOf(fn), 1)
  }

  const clear = () => {
    events = []
  }

  const listeners = (ev) => {
    return events[ev] || []
  }

  return {
    emit,
    on,
    clear,
    listeners
  }
}
