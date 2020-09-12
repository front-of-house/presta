function createObject (id) {
  return {
    a: `abcdefghijklmnopqrstuvwxyz-${id}`,
    b: `abcdefghijklmnopqrstuvwxyz-${id}`,
    c: `abcdefghijklmnopqrstuvwxyz-${id}`,
    d: `abcdefghijklmnopqrstuvwxyz-${id}`,
    e: `abcdefghijklmnopqrstuvwxyz-${id}`,
    f: `abcdefghijklmnopqrstuvwxyz-${id}`,
    g: `abcdefghijklmnopqrstuvwxyz-${id}`
  }
}

require('http')
  .createServer((req, res) => {
    const id = req.url.split('?')[1].split('id=')[1]

    res.writeHead(200, {
      'content-type': 'application/json'
    })
    res.end(JSON.stringify(createObject(id)))
  })
  .listen(4001, () => console.log('listening on 4001'))
