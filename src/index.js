require('./utils/require')

const wamp = require('connwamp')

const config = require('./config')
const initModules = rrequire('utils/init')

async function init() {
    await wamp.connect(config.socket.url, { realm: config.socket.realm })

    const moduleStatus = await initModules()

    moduleStatus.forEach(({ status, message }) => {
        console.log(`${status.toUpperCase()} - ${message}`)
    })
}

init()
    .then(() => {
        console.log(`Running NODE Server as ${config.envName.toUpperCase()}`)
    })
    .catch(err => {
        console.log('Something went wrong while starting the server - ERROR: ', err)
    })
