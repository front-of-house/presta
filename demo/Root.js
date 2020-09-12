const { default: fetch } = require('node-fetch')
const { load } = require('presta/load')

export async function getPaths () {
  const paths = []

  for (let i = 0; i < 100; i++) {
    paths.push(i + '')
  }

  return paths
}

export function Page ({ pathname }) {
  const data = load(
    async () =>
      fetch(`http://localhost:4001/?id=${pathname}`).then(res => res.json()),
    {
      key: pathname
    }
  )

  if (!data) return

  return `
    <div>${JSON.stringify(data)}</div>
  `
}
