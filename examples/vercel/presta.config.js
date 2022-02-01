import vercel from '@presta/adapter-vercel'

export const files = 'src/pages/*.ts'
export const plugins = [vercel()]
