import { Presta } from './lib/config'

declare global {
  namespace NodeJS {
    interface Global {
      __presta__: Presta
    }
  }
}
