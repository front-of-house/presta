export const style = {
  'html, body': {
    fs: '100%',
    ff: 'sans',
    color: 'dark'
  },
  '*, *::before, *::after': {
    m: 0,
    boxSizing: 'border-box',
    '-moz-osx-font-smoothing': 'grayscale'
  },
  '::selection': {
    bg: 'accent'
  },
  'a, button, [role="button"], input, label, select, textarea': {
    touchAction: 'manipulation'
  },
  button: {
    bg: 'transparent',
    border: 0,
    outline: 0,
    cursor: 'pointer'
  },
  a: {
    c: 'accent',
    textDecoration: 'none',
    '&:visited': {
      c: 'accent'
    },
    '&:focus, &:hover': {
      textDecoration: 'underline'
    },
    '&:focus': {
      outline: '2px dashed',
      outlineColor: 'accent',
      outlineOffset: '4px'
    }
  },
  h1: {
    fs: '3rem',
    lh: '1.1'
  },
  h2: {
    fs: '2.2rem',
    lh: '1.2'
  },
  h3: {
    fs: '1.6rem',
    lh: '1.3'
  },
  h4: {
    fs: '1.2rem',
    lh: '1.4'
  },
  h5: {
    fs: '1rem',
    lh: '1.5'
  },
  h6: {
    fs: '0.875rem',
    lh: '1.5'
  },
  'p, .p': {
    fs: '1rem',
    lh: '1.6'
  }
}
