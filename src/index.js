const logger = require('loglevel')

require('./utils/require')

const initModules = rrequire('utils/init')

async function init() {
    const moduleStatus = await initModules()

    moduleStatus.forEach(status => {
        logger.info(status)
    })
}

init()
