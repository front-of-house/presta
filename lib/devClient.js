export function createDevClient ({ port }) {
  return `
    <script>
      (function (global) {
        try {
          const socketio = document.createElement('script')
          socketio.src = 'https://unpkg.com/pocket.io@0.1.4/min.js'
          socketio.onload = function init () {
            var disconnected = false
            var socket = io('http://localhost:${port}', {
              reconnectionAttempts: 3
            })
            socket.on('connect', function() { console.log('presta connected') })
            socket.on('refresh', function(file) {
              const normal = file.replace(/^\\//, '');
              const pathname = window.location.pathname;

              let pathToMatch;

              if (/\.html$/.test(normal)) {
                if (normal === 'index.html') {
                  pathToMatch = '/';
                } else {
                  const [_, pathname] = normal.match(/(.+)\\/.+\\.html$/) || [];
                  pathToMatch = '/' + pathname;
                }
              }

              if (pathToMatch && pathToMatch === pathname) {
                global.location.reload()
              } else if (!pathToMatch) {
                global.location.reload()
              }
            })
            socket.on('disconnect', function() {
              disconnected = true
            })
            socket.on('reconnect_failed', function(e) {
              if (disconnected) return
              console.error("presta - connection to server on :${port} failed")
            })
          }
          document.head.appendChild(socketio)
        } catch (e) {}
      })(this);
    </script>
  `
}
