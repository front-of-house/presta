import { createConfig } from 'presta'
import netlify from '@presta/adapter-netlify'

export default createConfig({
  files: ['src/pages/*', 'src/api/*'],
  plugins: [netlify()],
})
