const config = {
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  presets: [
    [
      '@babel/preset-react',
      {
        pragma: 'h',
        pragmaFrag: 'h'
      }
    ]
  ]
}

module.exports = {
  config
}
