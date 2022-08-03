import { createConfig } from 'presta'
import node from '@presta/adapter-node'

export default createConfig({
  files: ['src/pages/*.ts'],
  plugins: [node()],
})
