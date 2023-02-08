#!/usr/bin/env node
require('dotenv').config()
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
channel.bind('devices.create.new', data => {
  axios(`https://kkt.wbtgroup.ru/api/v2/receipts/${data.uuid}`).then((response) => {
    let data = response.data
    axios.post(host + '/api/v2/devices')
      .then(response => axios.post(data.callback, response.data))
      .catch(error => console.log(error.response.data))
  })
})

