const socket = {
    realm: process.env.WS_REALM || 'development',
    url: process.env.WS_URL || 'ws://localhost:8080/ws',
}

const envName = process.env.NODE_ENV || 'development'
const mongo = { url: process.env.MONGO_URL || 'mongodb://localhost:27017/enegep' }

const isProduction = envName === 'production'
const isDevelopment = envName === 'development'

module.exports = {
    mongo,
    socket,
    envName,
    isProduction,
    isDevelopment,
}
