import vercel from '@presta/adapter-vercel'

export const files = 'pages/*.ts'
export const plugins = [vercel()]
