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
