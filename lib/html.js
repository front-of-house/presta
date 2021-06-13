const { createHeadTags, createFootTags } = require('./createHeadTags')

function html ({
  body = '',
  head = {},
  foot = {},
  htmlAttributes = {},
  bodyAttributes = {}
}) {
  // insert favicon during dev, if not otherwise specified
  if (
    head.link &&
    !head.link.find(m => m.rel === 'icon' || /rel="icon/.test(m + ''))
  ) {
    console.log('add icon')
    head.link.push({
      rel: 'icon',
      type: 'image/png',
      href: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJSSURBVHgB7ZbdcdpAEIB3T6DE9otLwB3YFQRXEFyBYWwYv5kOAhWEvGHxEFIBcQWQCkwqiNIBDwHHKNJmTzCKjO9AAiYzmew3oxmd7va0f7e3AIIgCIIgCIIgCILwf4JZFlGzeRxMp5eEWObhKQuVFhM0AUSfn7Eiui943mf4y6w1QCv+aza7JaImK3kMm9HGdNy7uw+wB54ajW+Js1K4npforWzCP+r10/ls9kAArYzKa0oclc6cf/x4c1OGHUEi038n6YHRAK28CzA0WZ+RkhNFw6DReAdbwg4oWRznpwfKJFhEHOTwuhUdPU6DAVWr+fcKw7Lpc4T4PT1+YYAThh938PwLeK9K4LoPsUdzoBCN0SsQDZ6tSw8e6/UqLCqNGaIRheFFqNRJ/ETROX9r0kpYDcQpldUInXo2JwZKfUmPn1Uh26mPUarmdrt9sMCyLZbdmPO8plX0vLZtXisfFw6jMPa5wtVW9lsKXl+XSamhSY43bL/yvBZs4OnqqgKO8z5DCvq6WqHjfC0soxcscv5yXQboqB90uz6YDFjjQZ/r7glkRKeJ4nTZ5znS2JyYnAFEfGOWpHvIgfZQpNQ5v45hf4xtGZAYwLdtybQgdJzc7YE2gqN2pr0Gu+Nz6lzYJv9EwBJyLqsT2BLttZColqFKmeGqVzw8PFvN+zSF5A1xlPqeCBTnc6twFg56vT6fixGfiyq3BreZLkhuEvnCar/u9TqblmbqRveFbg5/TqcVvqTe4qJvStqFZZTGqL1+dPQJO52tIy8IgiAIgiD8I/wGlKzp9SA8zyUAAAAASUVORK5CYII=`
    })
  }

  // insert default charset and viewport, if not otherwise specified
  if (head.meta) {
    if (!head.meta.find(m => !!m.charset)) {
      head.meta.push({ charset: 'UTF-8' })
    }
    if (!head.meta.find(m => m.name === 'viewport')) {
      head.meta.push({
        name: 'viewport',
        content: 'width=device-width,initial-scale=1'
      })
    }
  }

  const headTags = createHeadTags(head)
  const footTags = createFootTags(foot)
  const htmlAttr = Object.keys(htmlAttributes).reduce((attr, key) => {
    return (attr += ` ${key}="${htmlAttributes[key]}"`)
  }, '')
  const bodyAttr = Object.keys(bodyAttributes).reduce((attr, key) => {
    return (attr += ` ${key}="${bodyAttributes[key]}"`)
  }, '')

  return `<!-- built with presta https://npm.im/presta --><!DOCTYPE html><html${htmlAttr}><head>${headTags}</head><body${bodyAttr}>${body}${footTags}</body></html>`
}

module.exports = {
  html
}
