function pathnameToHtmlFile (pathname) {
  return /\.(html|htm|xml|json|js|md)$/.test(pathname)
    ? pathname
    : pathname + '/index.html'
}

module.exports = { pathnameToHtmlFile }
