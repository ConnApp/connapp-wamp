const logger = require('loglevel')

require('./utils/require')

const config = require('./config')

const initModules = rrequire('utils/init')

async function init() {
    const moduleStatus = await initModules()

    moduleStatus.forEach(status => {
        logger.info(status)
    })
}

init()
    .then(() => {
        console.log(`Running node server as ${config.envName}`)
    })
    .catch(err => {
        console.log('Something went wrong while starting the server', err)
    })
