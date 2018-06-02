require('./utils/require')

const config = require('./config')

const initModules = rrequire('utils/init')

async function init() {
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
        console.log('Something went wrong while starting the server', err)
    })
