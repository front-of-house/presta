import { Callable } from './types'

export function createEmitter() {
  let events: { [event: string]: Callable[] } = {}

  function emit(ev: string, ...args: any[]): void {
    events[ev] ? events[ev].map((fn: Callable) => fn(...args)) : []
  }

  function on(ev: string, fn: (...args: any[]) => void) {
    events[ev] = events[ev] ? events[ev].concat(fn) : [fn]
    return () => events[ev].splice(events[ev].indexOf(fn), 1)
  }

  function clear() {
    events = {}
  }

  function listeners(ev: string) {
    return events[ev] || []
  }

  return {
    emit,
    on,
    clear,
    listeners,
  }
}

export function createEmitHook(name: string, emitter: ReturnType<typeof createEmitter>) {
  return function hook<T>(props: T) {
    emitter.emit(name, props)
  }
}

export function createOnHook(name: string, emitter: ReturnType<typeof createEmitter>) {
  return function hook(callback: Callable) {
    return emitter.on(name, callback)
  }
}
