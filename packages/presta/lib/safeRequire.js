function safeRequire(filepath, def) {
  try {
    return require(filepath)
  } catch (e) {
    return def
  }
}

module.exports = { safeRequire }
