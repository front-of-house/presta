import * as presets from 'hypostyle/presets'

export const theme = {
  ...presets,
  tokens: {
    ...presets.tokens,
    color: {
      dark: 'var(--dark)',
      light: 'var(--light)',
      blue: 'var(--blue)',
      pink: 'var(--pink)',
      green: 'var(--green)',
      yellow: 'var(--yellow)'
    },
    width: {
      s: '400px',
      m: '800px',
      l: '1000px',
      xl: '1300px'
    },
    fontSize: ['4rem', '4rem', '2.8rem', '2rem', '1.4rem', '1rem', '0.875rem'],
    fontFamily: {
      sans: `'Roboto', -apple-system, system-ui, BlinkMacSystemFont, sans-serif`,
      mono: `'Roboto Mono', monospace`
    }
  }
}
