#!/usr/bin/env node

const fs = require("fs-extra");
const serve = require("./serve");
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

// just make sure it's there
fs.ensureDirSync(PRESTA_DIR);

(async () => {
  if (config.command === 'serve') {
    return serve(args.i || args.in || config.output);
  }

  // clear entire dir
  if (args.clean) fs.emptyDirSync(PRESTA_DIR);

  // clear compiled pages
  fs.emptyDirSync(PRESTA_PAGES);
  fs.emptyDirSync(PRESTA_WRAPPED_PAGES);

  if (config.command === "watch") {
    console.log(
      c.blue("presta watch"),
      config.incremental ? c.gray("awaiting changes") : ""
    );
    console.log("");

    watch(config);
  } else if (config.command === "build") {
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
  }
})();
