const fs = require('fs-extra')
const path = require("path");
const rev = require("rev-hash");

const { PRESTA_DIR } = require("./constants");
const { safeRequire } = require("./safeRequire");

const fileHash = safeRequire(path.join(PRESTA_DIR, "hash.json"), {});

function save() {
  fs.writeFileSync(path.join(PRESTA_DIR, "hash.json"), JSON.stringify(fileHash));
}

function get(id) {
  return fileHash[id]
}

function set(id, value, extra = {}) {
  fileHash[id] = {
    ...(fileHash[id] || {}),
    rev: value,
    ...extra
  }
}

function remove(id) {
  delete fileHash[id]
}

function hash(filepath) {
  return rev(fs.readFileSync(filepath, "utf-8"))
}

function keys() {
  return Object.keys(fileHash)
}

module.exports = { get, set, remove, save, hash, keys };
