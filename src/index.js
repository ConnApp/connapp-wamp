const wamp = require('connwamp')

const config = require('./config')
const servicesInit = require('./services')

async function init() {
    await wamp.connect(config.socket.url, { realm: config.socket.realm })

    await servicesInit()
}

init()
    .then(() => {
        console.log(`Running NODE Server as ${config.envName.toUpperCase()}`)
    })
    .catch(err => {
        console.log('Something went wrong while starting the server - ERROR: ', err)
    })
