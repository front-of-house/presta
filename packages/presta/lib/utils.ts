export function requireFresh(mod: string) {
  delete require.cache[mod]
  return require(mod)
}

export function requireSafe(mod: string) {
  try {
    return requireFresh(mod)
  } catch (e) {
    return {}
  }
}

export function hashContent(content: string) {
  var h = 5381,
    i = content.length

  while (i) h = (h * 33) ^ content.charCodeAt(--i)

  return (h >>> 0).toString(36)
}

export function createLiveReloadScript({ port }: { port: number }) {
  return `
    <script>
      (function (global) {
        var socket = new WebSocket('ws://localhost:${port}');

        socket.addEventListener('open', function (event) {
          console.log('[presta] connected on port ${port}')
        });

        socket.addEventListener('message', function (event) {
          console.log(\`'[presta] received \$\{event.data\}\`)
          if (event.data === 'refresh') {
            global.location.reload();
          }
        });

        socket.addEventListener('close', function () {
          console.log('[presta] disconnected')
        });
      })(this);
    </script>
  `
}
