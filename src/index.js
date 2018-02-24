const logger = require('loglevel')

require('./utils/require')

const config = require('./config')

const initModules = require('./utils/init')

async function init() {
    const moduleStatus = await initModules(config)

    moduleStatus.forEach(status => {
        logger.info(status)
    })
}

init()
