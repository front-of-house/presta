import { Presta } from './'

declare global {
  namespace NodeJS {
    interface Global {
      __presta__: Presta
    }
  }
}
