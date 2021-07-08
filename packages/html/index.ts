import merge from 'deepmerge'

type GenericObject = { [key: string]: any }

export type HeadElementWithChildren<T> = {
  children?: string
} & T

export type Meta = Partial<Omit<HTMLMetaElement, 'children'>> | string
export type Link = Partial<Omit<HTMLLinkElement, 'children'>> | string
export type Style = Partial<HeadElementWithChildren<Omit<HTMLStyleElement, 'children'>>> | string
export type Script = Partial<HeadElementWithChildren<Omit<HTMLScriptElement, 'children'>>> | string
export type HeadElement = Meta | Link | Style | Script

type Social = {
  title?: string
  description?: string
  image?: string
  url?: string
  [key: string]: string | undefined
}

export type PrestaHead = {
  title: string
  description: string
  image: string
  url: string
  og: Social
  twitter: Social
  meta: Meta[]
  link: Link[]
  script: Script[]
  style: Style[]
}

const defaults: PrestaHead = {
  title: 'Presta',
  description: '',
  image: '',
  url: '',
  og: {},
  twitter: {},
  meta: [
    // @ts-ignore
    { charset: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ],
  link: [],
  script: [],
  style: [],
}

export function pruneEmpty(obj: GenericObject) {
  let res: GenericObject = {}

  for (const k of Object.keys(obj)) {
    if (!!obj[k]) res[k] = obj[k]
  }

  return res
}

export function filterUnique(arr: HeadElement[]) {
  let res: HeadElement[] = []

  outer: for (const a of arr.reverse()) {
    for (const r of res) {
      if (typeof a === 'string' || typeof r === 'string') {
        if (a === r) continue outer
      } else {
        // @ts-ignore
        if (a.name && a.name === r.name) continue outer
        // @ts-ignore
        if (a.src && a.src === r.src) continue outer
        // @ts-ignore
        if (a.href && a.href === r.href) continue outer
      }
    }

    res.push(a)
  }

  return res.reverse()
}

export function tag(name: string) {
  return (props: HeadElement) => {
    if (typeof props === 'string') return props

    const attr = Object.keys(props)
      .filter((p) => p !== 'children')
      // @ts-ignore
      .map((p) => `${p}="${props[p]}"`)
      .join(' ')

    const attributes = attr ? ' ' + attr : ''

    if (/script|style/.test(name)) {
      // @ts-ignore
      return `<${name}${attributes}>${props.children || ''}</${name}>`
    } else {
      return `<${name}${attributes} />`
    }
  }
}

export function prefixToObjects(prefix: string, props: Social): HeadElementWithChildren<Partial<HTMLMetaElement>>[] {
  return Object.keys(props).map((p) => ({
    [prefix === 'og' ? 'property' : 'name']: `${prefix}:${p}`,
    content: props[p],
  }))
}

export function createHeadTags(config: Partial<PrestaHead> = {}) {
  const { title, description, image, url, ...o } = merge(defaults, config)

  const meta = o.meta ? filterUnique(o.meta) : []
  const link = o.link ? filterUnique(o.link) : []
  const script = o.script ? filterUnique(o.script) : []
  const style = o.style ? filterUnique(o.style) : []
  const og = pruneEmpty({
    title,
    description,
    url,
    image,
    ...(o.og || {}),
  })
  const twitter = pruneEmpty({
    title,
    description,
    url,
    image,
    ...(o.twitter || {}),
  })

  const tags = [
    meta.concat(description ? { name: 'description', content: description } : []).map(tag('meta')),
    prefixToObjects('og', og).map(tag('meta')),
    prefixToObjects('twitter', twitter).map(tag('meta')),
    link.map(tag('link')),
    script.map(tag('script')),
    style.map(tag('style')),
  ].flat(2)

  return `<title>${title}</title>${tags.join('')}`
}

export function createFootTags(config: Partial<Pick<PrestaHead, 'script' | 'style'>> = {}) {
  const o = merge({ script: [], style: [] }, config)
  const script = filterUnique(o.script)
  const style = filterUnique(o.style)

  const tags = [script.map(tag('script')), style.map(tag('style'))].flat()

  return tags.join('')
}

export function html({
  body = '',
  head = {},
  foot = {},
  htmlAttributes = {},
  bodyAttributes = {},
}: {
  body?: string
  head?: Partial<PrestaHead>
  foot?: Partial<Pick<PrestaHead, 'script' | 'style'>>
  htmlAttributes?: Partial<{ [key in keyof HTMLHtmlElement]: string }>
  bodyAttributes?: Partial<HTMLBodyElement>
}) {
  // insert favicon during dev, if not otherwise specified
  if (head.link && !head.link.find((m) => (typeof m === 'object' ? m.rel === 'icon' : /rel="icon/.test(m)))) {
    head.link.push({
      rel: 'icon',
      type: 'image/png',
      href: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJSSURBVHgB7ZbdcdpAEIB3T6DE9otLwB3YFQRXEFyBYWwYv5kOAhWEvGHxEFIBcQWQCkwqiNIBDwHHKNJmTzCKjO9AAiYzmew3oxmd7va0f7e3AIIgCIIgCIIgCILwf4JZFlGzeRxMp5eEWObhKQuVFhM0AUSfn7Eiui943mf4y6w1QCv+aza7JaImK3kMm9HGdNy7uw+wB54ajW+Js1K4npforWzCP+r10/ls9kAArYzKa0oclc6cf/x4c1OGHUEi038n6YHRAK28CzA0WZ+RkhNFw6DReAdbwg4oWRznpwfKJFhEHOTwuhUdPU6DAVWr+fcKw7Lpc4T4PT1+YYAThh938PwLeK9K4LoPsUdzoBCN0SsQDZ6tSw8e6/UqLCqNGaIRheFFqNRJ/ETROX9r0kpYDcQpldUInXo2JwZKfUmPn1Uh26mPUarmdrt9sMCyLZbdmPO8plX0vLZtXisfFw6jMPa5wtVW9lsKXl+XSamhSY43bL/yvBZs4OnqqgKO8z5DCvq6WqHjfC0soxcscv5yXQboqB90uz6YDFjjQZ/r7glkRKeJ4nTZ5znS2JyYnAFEfGOWpHvIgfZQpNQ5v45hf4xtGZAYwLdtybQgdJzc7YE2gqN2pr0Gu+Nz6lzYJv9EwBJyLqsT2BLttZColqFKmeGqVzw8PFvN+zSF5A1xlPqeCBTnc6twFg56vT6fixGfiyq3BreZLkhuEvnCar/u9TqblmbqRveFbg5/TqcVvqTe4qJvStqFZZTGqL1+dPQJO52tIy8IgiAIgiD8I/wGlKzp9SA8zyUAAAAASUVORK5CYII=`,
    })
  }

  // insert default charset and viewport, if not otherwise specified
  if (head.meta) {
    // @ts-ignore TODO wtf
    if (!head.meta.find((m) => !!m.charset)) {
      // @ts-ignore
      head.meta.push({ charset: 'UTF-8' })
    }
    if (!head.meta.find((m) => (typeof m === 'object' ? m.name === 'viewport' : /name="viewport/.test(m)))) {
      head.meta.push({
        name: 'viewport',
        content: 'width=device-width,initial-scale=1',
      })
    }
  }

  const headTags = createHeadTags(head)
  const footTags = createFootTags(foot)
  const htmlAttr = Object.keys(htmlAttributes).reduce((attr, key) => {
    return (attr += ` ${key}="${htmlAttributes[key as keyof HTMLHtmlElement]}"`)
  }, '')
  const bodyAttr = Object.keys(bodyAttributes).reduce((attr, key) => {
    return (attr += ` ${key}="${bodyAttributes[key as keyof HTMLBodyElement]}"`)
  }, '')

  return `<!-- built with presta https://npm.im/presta --><!DOCTYPE html><html${htmlAttr}><head>${headTags}</head><body${bodyAttr}>${body}${footTags}</body></html>`
}
