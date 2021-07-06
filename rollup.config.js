import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default {
  output: {
    format: 'cjs',
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    resolve(),
    typescript(),
    terser()
  ],
}
