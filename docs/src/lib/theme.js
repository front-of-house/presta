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
    },
    boxShadow: {
      shadow: `0px 0px 1px var(--dAlpha), 0px 4px 8px var(--dAlpha), 0px 16px 24px var(--dAlpha), 0px 24px 32px var(--dAlpha)`
    }
  }
}
