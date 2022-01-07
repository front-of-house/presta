export enum Events {
  PostBuild = 'post-build',
  BuildFile = 'build-file',
  BrowserRefresh = 'browser-refresh',
}

export type Callable = (...args: any[]) => void

export type HookPostBuildPayload = {
  output: string
  staticOutput: string
  functionsOutput: string
  functionsManifest: Record<string, string>
}

export type HookBuildFilePayload = {
  file: string
}

export type DestroyHookCallback = () => void

export type Hooks = {
  emitPostBuild(props: HookPostBuildPayload): void
  onPostBuild(cb: (props: HookPostBuildPayload) => void): DestroyHookCallback
  emitBuildFile(props: HookBuildFilePayload): void
  onBuildFile(cb: (props: HookBuildFilePayload) => void): DestroyHookCallback
  emitBrowserRefresh(): void
  onBrowserRefresh(cb: () => void): DestroyHookCallback
}

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

export function createHooks(emitter: ReturnType<typeof createEmitter>): Hooks {
  return {
    emitPostBuild(props) {
      emitter.emit('postBuild', props)
    },
    onPostBuild(cb) {
      return emitter.on('postBuild', cb)
    },
    emitBuildFile(props) {
      emitter.emit('buildFile', props)
    },
    onBuildFile(cb) {
      return emitter.on('buildFile', cb)
    },
    emitBrowserRefresh() {
      emitter.emit('browserRefresh')
    },
    onBrowserRefresh(cb) {
      return emitter.on('browserRefresh', cb)
    },
  }
}
