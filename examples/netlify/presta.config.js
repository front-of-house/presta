import netlify from '@presta/adapter-netlify'

export const files = 'src/pages/*.js'

export const plugins = [netlify()]
