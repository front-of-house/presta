import { requireFresh } from './requireFresh'

export function requireSafe(mod: string) {
  try {
    return requireFresh(mod)
  } catch (e) {
    return {}
  }
}
