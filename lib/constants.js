import path from 'path'

export const CWD = process.cwd()
export const PRESTA_DIR = path.join(CWD, '.presta')
export const PRESTA_PAGES = path.join(PRESTA_DIR, 'pages')
export const PRESTA_WRAPPED_PAGES = path.join(PRESTA_DIR, 'static')
export const PRESTA_FUNCTIONS = path.join(PRESTA_DIR, 'functions')
export const PRESTA_CONFIG_DEFAULT = path.join(CWD, 'presta.config') // no extension

// all possible extensions
export const PRESTA_CONFIGS_WITH_EXTENSIONS = [
  PRESTA_CONFIG_DEFAULT + '.js',
  PRESTA_CONFIG_DEFAULT + '.ts',
  PRESTA_CONFIG_DEFAULT + '.jsx',
  PRESTA_CONFIG_DEFAULT + '.tsx'
]
