export function requireFresh(mod: string) {
  delete require.cache[mod]
  return require(mod)
}

export function requireSafe(mod: string) {
  try {
    return requireFresh(mod)
  } catch (e) {
    return {}
  }
}
