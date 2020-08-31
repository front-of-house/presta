function encodeFilename(filename) {
  return filename
    .split(".")
    .reverse()
    .slice(1)
    .reverse()
    .join("")
    .replace(/\//g, "@");
}

module.exports = { encodeFilename }
