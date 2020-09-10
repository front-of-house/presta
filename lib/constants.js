const path = require('path')

const CWD = process.cwd()
const PRESTA_DIR = path.join(CWD, '.presta')
const PRESTA_PAGES = path.join(PRESTA_DIR, 'pages')
const PRESTA_WRAPPED_PAGES = path.join(PRESTA_DIR, 'wrapped')

module.exports = {
  CWD,
  PRESTA_DIR,
  PRESTA_PAGES,
  PRESTA_WRAPPED_PAGES
}
