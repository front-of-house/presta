import path from 'path'

export const pathnameToFile = (pathname: string, ext = 'html') => {
  return !!path.extname(pathname)
    ? pathname // if path has extension, use it
    : ext === 'html'
    ? `${pathname}/index.html` // if HTML is inferred, create index
    : `${pathname}.${ext}` // anything but HTML will need an extension, otherwise browsers will render as text
}
