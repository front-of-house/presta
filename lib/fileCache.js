import path from 'path'
import cache from 'flat-cache'

const cwd = process.cwd()

export const fileCache = cache.load(
  'presta',
  path.resolve(cwd, './.presta/cache')
)
