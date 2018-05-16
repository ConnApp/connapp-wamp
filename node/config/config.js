// Imports and packages
const path = require('path')
const w3cws = require('websocket').w3cwebsocket

// Function to get current directory
const getCurrentDir = () => (path.resolve(__dirname) + '/')

// Directory config object
const DIR = {
  ROOT: getCurrentDir().replace('config/', ''),
  CURRENT: getCurrentDir
}

// Mongo connection config object
const MONGO = {
  URL: 'mongodb://localhost:27017/enegep'
}

// Websocket/WAMP config object
const WEBSOCKET = {
  URL: 'ws://localhost:8080/ws',
  REALM: 'realm1',
  CLIENT: w3cws
}

// Config object export
module.exports = {
  WEBSOCKET: WEBSOCKET,
  MONGO: MONGO,
  DIR: DIR
}
