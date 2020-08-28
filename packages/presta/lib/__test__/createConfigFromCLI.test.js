const sinon = require("sinon");
const proxy = require("proxyquire");

const { createConfigFromCLI } = require("../createConfigFromCLI");

// const args = {
//   _: [],
//   c: '', // config
//   r: '', // runtime
//   i: '', // in
//   o: '', // out
//   inc: false, // incremental
// }

const i = "pages/**/*.js";
const o = "output";
const c = "presta-config.js";
const r = "presta-runtime.js";

module.exports = async function (test, assert) {
  test("createConfigFromCLI - throws with no input", async () => {
    try {
      const config = createConfigFromCLI({
        _: ["build"],
        o,
      });
    } catch (e) {
      assert(e);
    }
  });

  test("createConfigFromCLI - input", async () => {
    const config = createConfigFromCLI({
      _: ["build"],
      i,
      o,
    });

    assert(config);
  });

  test("createConfigFromCLI - output", async () => {
    const config = createConfigFromCLI({
      _: ["build"],
      i,
      o: 'test',
    });

    assert(/\/test$/.test(config.output));
  });

  test("createConfigFromCLI - baseDir", async () => {
    const config = createConfigFromCLI({
      _: ["build"],
      i,
      o,
    });

    assert(/\/pages$/.test(config.baseDir));
  });

  test("createConfigFromCLI - incremental", async () => {
    const config = createConfigFromCLI({
      _: ["build"],
      i,
      o,
      inc: true
    });

    assert(config.incremental);
  });

  test("createConfigFromCLI - c, config args", async () => {
    const spy = sinon.spy();

    const { createConfigFromCLI } = proxy("../createConfigFromCLI", {
      "./safeConfigFilepath": {
        safeConfigFilepath: spy,
      },
    });

    createConfigFromCLI({
      _: ["build"],
      i,
      o,
      c,
    });

    assert(spy.calledWith(c));

    createConfigFromCLI({
      _: ["build"],
      i,
      o,
      config: c,
    });

    assert(spy.calledWith(c));
  });

  test("createConfigFromCLI - r, runtime args", async () => {
    const spy = sinon.spy();

    const { createConfigFromCLI } = proxy("../createConfigFromCLI", {
      "./safeConfigFilepath": {
        safeConfigFilepath: spy,
      },
    });

    createConfigFromCLI({
      _: ["build"],
      i,
      o,
      r,
    });

    assert(spy.calledWith(r));

    createConfigFromCLI({
      _: ["build"],
      i,
      o,
      runtime: r,
    });

    assert(spy.calledWith(r));
  });

  test("createConfigFromCLI - config file", async () => {
    const { createConfigFromCLI } = proxy("../createConfigFromCLI", {
      "./safeConfigFilepath": {
        safeConfigFilepath(filepath) {
          return filepath
        }
      },
      "./safeRequire": {
        safeRequire() {
          return {
            input: i,
            output: o,
            incremental: true,
            runtimeFile: 'runtime',
          };
        },
      },
    });

    const config = createConfigFromCLI({
      _: ["build"],
      c,
    });

    assert.equal(config.input, i)
    assert(config.output.indexOf(o) > -1)
    assert(config.incremental)
    assert.equal(config.configFilepath, c)
    assert.equal(config.runtimeFilepath, 'runtime')
  });
};
