import path from 'path'

export const CWD = process.cwd()
export const PRESTA_DIR = path.join(CWD, '.presta')
export const PRESTA_PAGES = path.join(PRESTA_DIR, 'pages')
export const PRESTA_WRAPPED_PAGES = path.join(PRESTA_DIR, 'wrapped')
