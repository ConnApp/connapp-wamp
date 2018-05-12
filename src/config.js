// Packages imports

const Wampy = require('wampy').Wampy
const w3cws = require('websocket').w3cwebsocket

const wsConfig = {
    client: w3cws,
    realm: process.env.WS_REAL || 'realm1',
    url: process.env.WS_URL || 'ws://localhost:8080/ws',
}

const websocket = {
    config: wsConfig,
    connection: new Wampy(wsConfig.url, {
        ws: wsConfig.client,
        realm: wsConfig.realm,
    }),
}

const mongo = { url: process.env.MONGO_URL || 'mongodb://localhost:27017/enegep' }

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const isProduction = !isDevelopment
const envName = process.env.NODE_ENV || 'development'

module.exports = {
    mongo,
    envName,
    websocket,
    isProduction,
    isDevelopment,
}
