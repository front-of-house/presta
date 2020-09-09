const path = require("path");
const assert = require("assert");
const debug = require("debug")("presta");

const { CWD } = require("./constants");
const { getGlobCommonDirectory } = require("./getGlobCommonDirectory");
const { safeConfigFilepath } = require("./safeConfigFilepath");
const { safeRequire } = require("./safeRequire");

function createConfigFromCLI(args) {
  const configFilepath = safeConfigFilepath(args.config);
  const configFile = safeRequire(configFilepath, {});
  const runtimeFilepath = safeConfigFilepath(args.runtime);
  const input = args.pages || configFile.pages;
  const output = args.output || configFile.output || "build";
  const incremental =
    typeof args.incremental !== undefined
      ? args.incremental
      : configFile.incremental;

  assert(!!input, `presta - please provide an input`);

  const config = {
    input,
    output: path.join(CWD, output),
    baseDir: path.resolve(CWD, getGlobCommonDirectory(input)),
    configFilepath,
    runtimeFilepath,
    incremental,
  };

  debug("config", config);

  return config;
}

module.exports = { createConfigFromCLI };
