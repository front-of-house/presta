import path from 'path'
import webpack from 'webpack'

import { CWD, OUTPUT_DYNAMIC_PAGES_ENTRY } from './constants'

const { NODE_ENV } = process.env

export function createConfig (config) {
  return {
    entry: {
      pages: path.join(config.output, OUTPUT_DYNAMIC_PAGES_ENTRY)
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
          use: ['babel-loader']
        }
      ]
    },
    resolve: {
      alias: {
        '@': CWD
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
