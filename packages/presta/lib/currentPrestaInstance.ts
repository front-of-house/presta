import type { Presta } from '..'

export enum Env {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}

const defaultConfig = {
  pid: process.pid,
  cwd: process.cwd(),
  env: Env.PRODUCTION,
  debug: false,
} as Presta

export function setCurrentPrestaInstance(config: Presta): Presta {
  // @ts-ignore
  global.__presta__ = config
  return config
}

export function getCurrentPrestaInstance(): Presta {
  // @ts-ignore
  if (!global.__presta__) {
    setCurrentPrestaInstance(defaultConfig)
  }

  // @ts-ignore
  return global.__presta__
}
