const path = require('path')

function pathnameToFile (pathname, ext = 'html') {
  return !!path.extname(pathname)
    ? pathname // if path has extension, use it
    : ext === 'html'
    ? `${pathname}/index.html` // if HTML is inferred, create index
    : `${pathname}.${ext}` // anything but HTML will need an extension, otherwise browsers will render as text
}

module.exports = { pathnameToFile }
