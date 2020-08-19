const path = require("path");
const { readEnv } = require("read-env");
const webpack = require("webpack");

const { CWD, PRESTA_PAGES } = require("./constants");
const { NODE_ENV } = process.env;

const base = {
  output: {
    libraryTarget: "commonjs2",
    filename: "[name].js",
  },
  mode: NODE_ENV === "production" ? "production" : "development",
  target: "node",
  node: {
    console: false,
    global: true,
    process: true,
    __filename: true,
    __dirname: true,
    Buffer: true,
    setImmediate: true,
  },
  performance: { hints: false },
  devtool: "eval-cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    alias: {
      "@": CWD,
    },
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  plugins: [new webpack.DefinePlugin(readEnv("PUBLIC"))],
  optimization: {
    minimize: false,
  },
};

function createConfig({ id, generatedFile }) {
  return {
    ...base,
    output: {
      ...base.output,
      path: PRESTA_PAGES,
    },
    entry: { [id]: generatedFile }
  };
}

function createCompiler(entries) {
  const configs = entries.map(createConfig);

  const compiler = webpack(configs);

  return {
    watch(cb) {
      const watcher = compiler.watch({}, (e, s) => {
        if (e) {
          return cb(e)
        }

        const stats = []
          .concat(s)
          .map((s) =>
            s.toJson({
              modules: false,
            })
          )
          .map((s) => s.children)
          .flat();

        const pages = stats
          .filter(s => {
            if (s.errors.length) {
              // TODO
              s.errors.forEach(e => {
                console.log('\n\n')
                console.error(e)
                console.log('\n\n')
              })
              return false
            } else {
              return true
            }
          })
          .map((s) => s.assets)
          .flat()
          .map((f) => [f.name, path.join(PRESTA_PAGES, f.name)]);

        cb(undefined, pages);
      });

      return () => {
        return new Promise((r) => {
          watcher.close(() => {
            r();
          });
        });
      };
    },
    build(cb) {
      compiler.run((e, s) => {
        if (e) {
          return cb(e)
        }

        const stats = []
          .concat(s)
          .map((s) =>
            s.toJson({
              modules: false,
            })
          )
          .map((s) => s.children)
          .flat();

        const pages = stats
          .map((s) => s.assets)
          .flat()
          .map((f) => [f.name, path.join(PRESTA_PAGES, f.name)]);

        cb(undefined, pages);
      })
    }
  };
}

module.exports = { createCompiler };
