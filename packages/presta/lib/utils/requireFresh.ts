export function requireFresh(mod: string) {
  delete require.cache[mod]
  return require(mod)
}
