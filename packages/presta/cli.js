#!/usr/bin/env node

const fs = require("fs-extra");
const serve = require("@presta/serve");
const c = require("ansi-colors");

const { watch, build } = require("./");
const {
  PRESTA_DIR,
  PRESTA_PAGES,
  PRESTA_WRAPPED_PAGES,
} = require("./lib/constants");
const { createConfigFromCLI } = require("./lib/createConfigFromCLI");

console.clear();

const args = require("minimist")(process.argv.slice(2));
const config = createConfigFromCLI(args);

function clean() {
  fs.ensureDirSync(PRESTA_DIR);
  fs.emptyDirSync(PRESTA_PAGES);
  fs.emptyDirSync(PRESTA_WRAPPED_PAGES);
}

(async () => {
  if (config.command === "watch") {
    clean();

    console.log(
      c.blue("presta watch"),
      config.incremental ? c.gray("awaiting changes") : ""
    );
    console.log("");

    watch(config);
  } else if (config.command === "build") {
    clean();

    console.log(
      c.blue("presta build"),
      config.incremental ? c.gray("checking cache") : ""
    );
    console.log("");

    const st = Date.now();

    await build(config);

    const time = Date.now() - st;
    console.log("");
    console.log(c.blue("built"), c.gray(`in ${time}ms`));
  } else if (config.command === "serve") {
    serve(config.args.i || config.args.in || config.output);
  }
})();
