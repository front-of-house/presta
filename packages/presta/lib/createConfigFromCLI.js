const path = require("path");
const assert = require("assert");
const debug = require("debug")("presta");

const { CWD } = require("./constants");
const { getGlobCommonDirectory } = require("./getGlobCommonDirectory");
const { safeConfigFilepath } = require("./safeConfigFilepath");
const { safeRequire } = require("./safeRequire");

function createConfigFromCLI(args) {
  const [command] = args._;

  const configFilepath = safeConfigFilepath(
    args.c || args.config || "presta.config.js"
  );
  const configFile = safeRequire(configFilepath, {});
  const runtimeFilepath = safeConfigFilepath(
    args.r || args.runtime || configFile.runtimeFile || "presta.runtime.js"
  );
  const input = args.i || args.in || configFile.input;
  const output = args.o || args.out || configFile.output || "build";
  const incremental =
    args.inc ||
    args.incremental ||
    configFile.incremental ||
    command === "watch"
      ? true
      : false;

  assert(!!input, `presta - please provide an input`);

  const config = {
    command,
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
