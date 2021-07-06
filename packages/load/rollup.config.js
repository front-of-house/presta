import config from '../../rollup.config'

export default {
  ...config,
  input: 'index.ts',
  output: {
    ...config.output,
    dir: 'dist',
  },
}
