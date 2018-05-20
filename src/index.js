require('./utils/require')

const config = require('./config')

const wamp = rrequire('wamp')
const initModules = rrequire('utils/init')

async function init(wampConnection) {
    const moduleStatus = await initModules(wampConnection)

    moduleStatus.forEach(({ status, message }) => {
        console.log(`${status.toUpperCase()} - ${message}`)
    })
}

init(wamp)
    .then(() => {
        console.log(`Running NODE Server as ${config.envName.toUpperCase()}`)
    })
    .catch(err => {
        console.log('Something went wrong while starting the server', err)
    })
