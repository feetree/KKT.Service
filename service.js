#!/usr/bin/env node

/**
 * Module dependencies.
 */

let app = require('./app')
let debug = require('debug')('kkt:server')
let http = require('http')
let axios = require('axios')
Pusher = require('pusher-js')
Pusher.logToConsole = true

let host = process.env.HOST

let pusher = new Pusher(process.env.PUSHER_KEY, {
  cluster: process.env.PUSHER_CLUSTER
})

let channel = pusher.subscribe(process.env.PUSHER_CHANNEL)

channel.bind('request', data => {
  axios.post(host + '/api/v2/requests', data)
    .then(response => console.log(response.data))
    .catch(error => console.log(error.response.data))
})

channel.bind('devices', data => {
  axios(host + '/api/v2/devices')
    .then(response => axios.post(data.callback, response.data))
    .catch(error => console.log(error.response.data))
})
channel.bind('request.get', data => {
  axios(host + '/api/v2/requests/' + data.uuid)
    .then(response => axios.post(data.callback, response.data))
    .catch(error => console.log(error.response.data))
})

channel.bind('devices.create', data => {
  axios.post(host + '/api/v2/devices')
    .then(response => axios.post(data.callback, response.data))
    .catch(error => console.log(error.response.data))
})

/**
 * Get port from environment and store in Express.
 */

let port = process.env.PORT || 3000
app.set('port', port)

let server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  let address = server.address()
  let bind = typeof address === 'string'
    ? 'pipe ' + address
    : 'port ' + address.port
  debug('Listening on ' + bind)
}
