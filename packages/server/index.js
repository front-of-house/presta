#! /usr/bin/env node
'use strict'

const cwd = process.cwd()

const fs = require('fs')
const path = require('path')
const http = require('http')
const getPort = require('get-port')
const c = require('ansi-colors')

const [ i, n ] = process.argv.slice(2)
const input = path.resolve(cwd, i || cwd)
const noreload = n || false

const serve = require('serve-static')(input)

;(async () => {
  const port = await getPort({ port: 4000 })

  const server = http.createServer((req, res) => {
    const { url } = req

    // static assets
    if (/^.+\..+$/.test(url)) {
      return serve(req, res, require('finalhandler')(req, res))
    }

    let status = 200
    let file = ''

    try {
      file = fs.readFileSync(path.join(input, url + '/index.html'), 'utf8')
    } catch (e) {
      status = 404
      try {
        file = fs.readFileSync(path.join(input, '/not-found.html'), 'utf8')
      } catch (e) {}
    }

    if (!noreload) {
      file += `
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
                socket.on('connect', () => console.log('@presta/serve connected'))
                socket.on('refresh', () => {
                  global.location.reload()
                })
                socket.on('disconnect', () => {
                  disconnected = true
                })
                socket.on('reconnect_failed', e => {
                  if (disconnected) return
                  console.error("@presta/serve - connection to server on :${port} failed")
                })
              }
              document.head.appendChild(socketio)
            } catch (e) {}
          })(this);
        </script>
      `
    }

    const ok = status < 299

    console.log(
      c.gray(status),
      ok ? c.blue(url) : c.white(url)
    )

    res.writeHead(status, {
      'Content-Type': 'text/html'
    })
    res.write(file)
    res.end()
  }).listen(port, () => {
    console.log(
      c.gray(`@presta/serve`),
      c.blue(`running`),
      `on 127.0.0.1:${port}`
    )
  })

  if (!noreload) {
    const socket = require('pocket.io')(server, {
      serveClient: false
    })

    fs.watch(input, { persistent: true, recursive: true }, (ev, fn) => {
      socket.emit('refresh')
    })
  }
})()

