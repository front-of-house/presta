import { createConfig } from 'presta'
import vercel from '@presta/adapter-vercel'

export default createConfig({
  files: ['src/pages/*.ts'],
  plugins: [vercel({})],
})
