export function hashContent (content: string) {
  var h = 5381,
    i = content.length

  while (i) h = (h * 33) ^ content.charCodeAt(--i)

  return (h >>> 0).toString(36)
}
