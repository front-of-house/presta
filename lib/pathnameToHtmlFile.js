export function pathnameToHtmlFile (pathname) {
  return /\.html$/.test(pathname) ? pathname : pathname + '/index.html'
}
