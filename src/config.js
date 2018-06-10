const socket = {
    realm: process.env.WS_REALM || 'development',
    url: process.env.WS_URL || 'ws://localhost:9000/ws',
}

const envName = process.env.NODE_ENV || 'development'
const mongo = { url: process.env.MONGO_URL || 'mongodb://localhost:27017/enegep' }

const isProduction = envName === 'production'
const isDevelopment = envName === 'development'

const node = {
    name: process.env.NODE_NAME || 'test_node',
    apiVersion: 'alpha',
    appConcern: 'connapp',
}

node.publishURI = `${node.appConcern}.${node.apiVersion}.${node.name}`
node.registerURI = `${node.appConcern}.${node.apiVersion}..${node.name}`

module.exports = {
    node,
    mongo,
    socket,
    envName,
    isProduction,
    isDevelopment,
}
