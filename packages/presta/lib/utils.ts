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

export function hashContent(content: string) {
  var h = 5381,
    i = content.length

  while (i) h = (h * 33) ^ content.charCodeAt(--i)

  return (h >>> 0).toString(36)
}
