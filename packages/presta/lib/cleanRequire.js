function cleanRequire(filepath) {
  delete require.cache[filepath];
  return require(filepath);
}

module.exports = { cleanRequire }
