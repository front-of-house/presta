import * as presets from 'hypostyle/presets'

export const theme = {
  ...presets,
  tokens: {
    ...presets.tokens,
    color: {
      dark: '#223355',
      accent: '#4488FF',
      medium: '#C2D0E8',
      light: '#DBE2EE'
    },
    fontFamily: {
      mono: `'IBM Plex Mono', monospace`,
      sans: `'IBM Plex Sans', -apple-system, system-ui, BlinkMacSystemFont, sans-serif`
    },
    fontSize: ['4rem', '4rem', '2.8rem', '2rem', '1.4rem', '1rem', '0.875rem'],
    lineHeight: ['1.1', '1.1', '1.2', '1.3', '1.4', '1.5', '1.5'],
    boxShadow: {
      shadow: `0px 0px 1px rgba(34, 51, 85, 0.1), 0px 4px 8px rgba(34, 51, 85, 0.1), 0px 16px 24px rgba(34, 51, 85, 0.1), 0px 24px 32px rgba(34, 51, 85, 0.1)`
    }
  }
}
