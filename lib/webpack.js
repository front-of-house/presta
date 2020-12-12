import path from 'path'
import webpack from 'webpack'
import { cosmiconfigSync } from 'cosmiconfig'

import { OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'
import { config as defaultBabelConfig } from './babel'

const { NODE_ENV } = process.env
const { config: userBabelConfig } = cosmiconfigSync('babel').search() || {}

export function createConfig (config) {
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
              options: userBabelConfig || {
                presets: defaultBabelConfig.presets
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
      extensions: ['.ts', '.tsx', '.js', '.json']
    },
    optimization: {
      minimize: false
    }
  }
}

export function compile (config) {
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
