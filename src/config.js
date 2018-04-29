// Packages imports

const Wampy = require('wampy').Wampy
const w3cws = require('websocket').w3cwebsocket

const wsConfig = {
    url: process.env.WS_URL || 'ws://localhost:8080/ws',
    realm: process.env.WS_REAL || 'realm1',
    client: w3cws,
}

const websocket = {
    config: wsConfig,
    connection: new Wampy(wsConfig.url, {
        ws: wsConfig.client,
        realm: wsConfig.realm,
    }),
}

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = !isDevelopment

const mongo = { url: process.env.MONGO_URL || 'mongodb://localhost:27017/enegep' }

module.exports = {
    websocket,
    isDevelopment,
    isProduction,
    mongo,
}
