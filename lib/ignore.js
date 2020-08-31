const fs = require('fs-extra')
const ignore = require("ignore");

const cwd = process.cwd()

let ignoreFile = "";
try {
  ignoreFile = fs.readFileSync(path.join(cwd, ".gitignore"), "utf-8");
} catch (e) {}

const ignoredFilesArray = ignoreFile.split(/\n/gm).filter(Boolean);
const ignorer = ignore().add(ignoredFilesArray);
const ignoredFilesFilterer = ignorer.createFilter();

module.exports = {
  ignoredFilesArray,
  ignoredFilesFilterer
}
