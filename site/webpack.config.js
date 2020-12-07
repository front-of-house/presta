const path = require('path')
const webpack = require('webpack')

const cwd = process.cwd()
const { NODE_ENV } = process.env

module.exports = {
  entry: {
    client: './client/index.js'
  },
  output: {
    path: path.join(cwd, './public')
  },
  performance: { hints: false },
  devtool: 'cheap-module-source-map',
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
      '@': cwd
    },
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
}
