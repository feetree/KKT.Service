#!/usr/bin/env node

let axios = require('axios')
const fs = require('fs')

let host = 'https://kkt.wbtgroup.ru/api'

axios.post(host + '/companies/1/stations/install').then(response => {
  fs.appendFileSync('.env', 'PUSHER_CHANNEL=' + response.data.uuid+'\n')
})
