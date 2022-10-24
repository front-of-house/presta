import netlify from '@presta/adapter-netlify'
import { createConfig } from 'presta'

export default createConfig({
  files: ['pages/*.ts'],
  plugins: [netlify()],
})
