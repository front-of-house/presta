import merge from 'deepmerge'

export type HeadElementWithChildren<T> = {
  children?: string
} & T

export type Meta = Partial<Omit<HTMLMetaElement, 'children'>>
export type Link = Partial<Omit<HTMLLinkElement, 'children'>>
export type Style = Partial<
  HeadElementWithChildren<Omit<HTMLStyleElement, 'children'>>
>
export type Script = Partial<
  HeadElementWithChildren<Omit<HTMLScriptElement, 'children'>>
>
export type HeadElement = (Meta & Link & Style & Script) | string

type Social = {
  title?: string
  description?: string
  image?: string
  url?: string
  [key: string]: string
}

export type PrestaHead = {
  title?: string
  description?: string
  image?: string
  url?: string
  og?: Social
  twitter?: Social
  meta?: Meta[]
  link?: Link[]
  script?: Script[]
  style?: Style[]
}

const defaults: PrestaHead = {
  title: 'Presta',
  description: '',
  image: '',
  url: '',
  og: {},
  twitter: {},
  meta: [
    `<meta charset="UTF-8"/>`,
    { name: 'viewport', content: 'width=device-width,initial-scale=1' }
  ],
  link: [],
  script: [],
  style: []
}

export function pruneEmpty (obj: object) {
  let res = {}

  for (const k of Object.keys(obj)) {
    if (!!obj[k]) res[k] = obj[k]
  }

  return res
}

export function filterUnique (arr: HeadElement[]) {
  let res: HeadElement[] = []

  outer: for (const a of arr.reverse()) {
    for (const r of res) {
      if (typeof a === 'string' || typeof r === 'string') {
        if (a === r) continue outer
      } else {
        if (a.name && a.name === r.name) continue outer
        if (a.src && a.src === r.src) continue outer
        if (a.href && a.href === r.href) continue outer
      }
    }

    res.push(a)
  }

  return res
}

export function tag (name: string) {
  return (props: HeadElement) => {
    if (typeof props === 'string') return props

    const attr = Object.keys(props)
      .filter(p => p !== 'children')
      .map(p => `${p}="${props[p]}"`)
      .join(' ')

    const attributes = attr ? ' ' + attr : ''

    if (/script|style/.test(name)) {
      return `<${name}${attributes}>${props.children || ''}</${name}>`
    } else {
      return `<${name}${attributes} />`
    }
  }
}

export function prefixToObjects (
  prefix: string,
  props: Social
): HeadElementWithChildren<Partial<HTMLMetaElement>>[] {
  return Object.keys(props).map(p => ({
    [prefix === 'og' ? 'property' : 'name']: `${prefix}:${p}`,
    content: props[p]
  }))
}

export function createHeadTags (config: PrestaHead = {}) {
  const { title, description, image, url, ...o } = merge(defaults, config)

  const meta = filterUnique(o.meta)
  const link = filterUnique(o.link)
  const script = filterUnique(o.script)
  const style = filterUnique(o.style)
  const og = pruneEmpty({
    title,
    description,
    url,
    image,
    ...(o.og || {})
  })
  const twitter = pruneEmpty({
    title,
    description,
    url,
    image,
    ...(o.twitter || {})
  })

  const tags = [
    meta
      .concat(description ? { name: 'description', content: description } : [])
      .map(tag('meta')),
    prefixToObjects('og', og).map(tag('meta')),
    prefixToObjects('twitter', twitter).map(tag('meta')),
    link.map(tag('link')),
    script.map(tag('script')),
    style.map(tag('style'))
  ].flat(2)

  return `<title>${title}</title>${tags.join('')}`
}

export function createFootTags (
  config: Pick<PrestaHead, 'script' | 'style'> = {}
) {
  const o = merge({ script: [], style: [] }, config)
  const script = filterUnique(o.script)
  const style = filterUnique(o.style)

  const tags = [script.map(tag('script')), style.map(tag('style'))].flat()

  return tags.join('')
}
