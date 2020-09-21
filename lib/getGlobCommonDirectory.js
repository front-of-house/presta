import path from 'path'

export function getGlobCommonDirectory (p) {
  const dir = path.dirname(p)
  if (/\*+/.test(dir)) {
    return getGlobCommonDirectory(dir)
  } else {
    return dir
  }
}
