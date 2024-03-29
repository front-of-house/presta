import { configure } from 'hypobox'
import { hypostyle as hypo } from 'hypostyle'
import * as presets from 'hypostyle/presets'

export const hypostyle = hypo({
  ...presets,
  tokens: {
    ...presets.tokens,
    fontFamily: {
      sans: 'sans-serif',
    },
  },
})

configure(hypostyle)

export const globalStyle = hypostyle.createGlobal({
  'html, body': {
    p: 0,
    m: 0,
  },
  '.active': {
    c: 'tomato',
  },
})
