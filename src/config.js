// Packages imports
const path = require('path')
const Wampy = require('wampy').Wampy
const w3cws = require('websocket').w3cwebsocket

// Mongo connection config object
const mongo = { url: 'mongodb://localhost:27017/enegep' }

// Websocket/WAMP config object
const websocket = {
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    client: w3cws,
}

const wsOptions = {
    ws: websocket.client,
    realm: websocket.realm,
}

module.exports = {
    mongo,
    websocket: {
        config: websocket,
        connections: new Wampy(websocket.url, wsOptions),
    },
}
