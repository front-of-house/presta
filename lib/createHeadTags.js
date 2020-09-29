import merge from 'deepmerge'

const defaults = {
  title: 'presta',
  description: 'The simple way to build the modern web.',
  og: {},
  twitter: {},
  meta: [
    `<meta charset="UTF-8"/>`,
    { name: 'viewport', content: ['width=device-width', 'initial-scale=1'] }
  ],
  link: [],
  script: [],
  style: []
}

function pruneEmpty (obj) {
  let res = {}

  for (const k of Object.keys(obj)) {
    if (!!obj[k]) res[k] = obj[k]
  }

  return res
}

export function filterUnique (arr) {
  let res = []

  outer: for (const a of arr) {
    for (const r of res) {
      if (a.name && a.name === r.name) continue outer
    }

    res.push(a)
  }

  return res
}

export function objectToTag (tag, props) {
  const attr = Object.keys(props)
    .filter(p => p !== 'children')
    .map(p => `${p}="${props[p]}"`)
    .join(' ')
  const attributes = attr ? ' ' + attr : ''

  if (tag === 'script')
    return `<script${attributes}>${props.children || ''}</script>`
  if (tag === 'style')
    return `<style${attributes}>${props.children || ''}</style>`
  return `<${tag}${attributes} />`
}

export function toTag (tag) {
  return o => (typeof o === 'string' ? o : objectToTag(tag, o))
}

export function prefixToObjects (prefix, props) {
  return Object.keys(props).map(p => ({
    [prefix === 'og' ? 'property' : 'name']: `${prefix}:${p}`,
    content: props[p]
  }))
}

export function createHeadTags (config = {}) {
  const { title, description, image, ...o } = merge(defaults, config)

  const meta = filterUnique(o.meta)
  const link = filterUnique(o.link)
  const script = filterUnique(o.script)
  const style = filterUnique(o.style)
  const og = pruneEmpty({
    title,
    description,
    image,
    ...(o.og || {})
  })
  const twitter = pruneEmpty({
    title,
    description,
    image,
    ...(o.twitter || {})
  })

  const tags = [
    meta
      .concat(description ? { name: 'description', content: description } : [])
      .map(toTag('meta')),
    prefixToObjects('og', og).map(toTag('meta')),
    prefixToObjects('twitter', twitter).map(toTag('meta')),
    link.map(toTag('link')),
    script.map(toTag('script')),
    style.map(toTag('style'))
  ].flat(2)

  return `<title>${title}</title>${tags.join('')}`
}

export function createFootTags (config = {}) {
  const o = merge({ script: [], style: [] }, config)
  const script = filterUnique(o.script)
  const style = filterUnique(o.style)

  const tags = [script.map(toTag('script')), style.map(toTag('style'))].flat()

  return tags.join('')
}
