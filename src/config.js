// Packages imports

const Wampy = require('wampy').Wampy
const w3cws = require('websocket').w3cwebsocket

const wsConfig = {
    url: 'ws://localhost:8080/ws',
    realm: 'realm1',
    client: w3cws,
}

const websocket = {
    config: wsConfig,
    connection: new Wampy(wsConfig.url, {
        ws: wsConfig.client,
        realm: wsConfig.realm,
    }),
}

const isLocal = process.env.DEVELOPMENT
const isProduction = process.env.isProduction

const mongo = { url: 'mongodb://localhost:27017/enegep' }

module.exports = {
    websocket,
    isLocal,
    isProduction,
    mongo,
}
