const path = require('path')
const webpack = require('webpack')

const { OUTPUT_DYNAMIC_PAGES_ENTRY } = require('./constants')

const { NODE_ENV } = process.env

function createConfig (config) {
  return {
    entry: {
      presta: path.join(config.output, OUTPUT_DYNAMIC_PAGES_ENTRY)
    },
    output: {
      libraryTarget: 'commonjs2',
      filename: '[name].js',
      path: path.join(config.output, 'functions')
    },
    mode: NODE_ENV === 'production' ? 'production' : 'development',
    target: 'node',
    node: {
      console: false,
      global: true,
      process: true,
      __filename: true,
      __dirname: true,
      Buffer: true,
      setImmediate: true
    },
    performance: { hints: false },
    devtool: 'inline-cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.(ts|js)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [require.resolve('@babel/preset-env')]
              }
            }
          ]
        }
      ]
    },
    resolve: {
      alias: {
        '@': config.cwd
      },
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    optimization: {
      minimize: false
    }
  }
}

function compile (config) {
  const webpackConfig = createConfig(config)

  return new Promise((y, n) => {
    webpack(webpackConfig).run((e, stats) => {
      if (e) {
        n(e)
      } else {
        y()
      }
    })
  })
}

module.exports = {
  createConfig,
  compile
}
