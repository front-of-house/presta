import { createPlugin as netlify } from '@presta/adapter-netlify'

export const files = 'pages/*.jsx'
export const plugins = [netlify()]
