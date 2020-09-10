const path = require('path')

function getGlobCommonDirectory (p) {
  const dir = path.dirname(p)
  if (/\*+/.test(dir)) {
    return getGlobCommonDirectory(dir)
  } else {
    return dir
  }
}

module.exports = { getGlobCommonDirectory }
