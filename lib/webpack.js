import path from 'path'
import webpack from 'webpack'

const { NODE_ENV } = process.env

export function createConfig (config) {
  return {
    entry: {
      presta: config.dynamicEntryFilepath
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
          test: /\.jsx?$/,
          use: {
            loader: '@sucrase/webpack-loader',
            options: {
              transforms: ['jsx']
            }
          }
        },
        {
          test: /\.tsx?$/,
          use: {
            loader: '@sucrase/webpack-loader',
            options: {
              transforms: ['typescript', 'jsx']
            }
          }
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
