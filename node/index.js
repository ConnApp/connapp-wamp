// Packages imports
const Wampy = require('wampy').Wampy

// Modules Imports
const CONFIG = require('./config/config.js')

// Exports Config object
module.exports.CONFIG = CONFIG
// console.log(module.exports.CONFIG)

// Websockets options
const wsOptions = {
  ws: CONFIG.WEBSOCKET.CLIENT,
  realm: CONFIG.WEBSOCKET.REALM
}

// Exports connection object
module.exports.connection = new Wampy(CONFIG.WEBSOCKET.URL, wsOptions)
// console.log(module.exports.connection)

// Exports disptcher module
module.exports.dispatcher = require('./lib/disptacher/dispatcher.js')
// console.log(module.exports.dispatcher)

// Exports connection object
module.exports.mongo = require('./lib/mongo/mongo.js')()
// console.log(module.exports.mongo)

// Exports disptcher module
module.exports.watcher = require('./lib/watcher/watcher.js')
// console.log(module.exports.watcher)
