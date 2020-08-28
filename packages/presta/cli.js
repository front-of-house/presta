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

const args = require("minimist")(process.argv.slice(2));
const config = createConfigFromCLI(args);

function clean() {
  fs.ensureDirSync(PRESTA_DIR);
  fs.emptyDirSync(PRESTA_PAGES);
  fs.emptyDirSync(PRESTA_WRAPPED_PAGES);
}

(async () => {
  console.clear();

  if (command === "watch") {
    clean();

    console.log(
      c.blue("presta watch"),
      incremental ? c.gray("awaiting changes") : ""
    );
    console.log("");

    watch(config);
  } else if (command === "build") {
    clean();

    console.log(
      c.blue("presta build"),
      incremental ? c.gray("checking cache") : ""
    );
    console.log("");

    const st = Date.now();

    await build(config);

    const time = Date.now() - st;
    console.log("");
    console.log(c.blue("built"), c.gray(`in ${time}ms`));
  } else if (command === "serve") {
    serve(args.i || args.in || config.output);
  }
})();
