const fs = require('fs')
const path = require('path')
const logger = require('loglevel')

const getRequireFunction = moduleName => {
    const prefix = moduleName[0].toLowerCase()

    const requireFunction = global[prefix + 'require']

    if (!requireFunction) {
        throw new Error(`No global require function defined for module ${moduleName}`)
    }

    if (typeof requireFunction !== 'function') {
        throw new Error(`Global require for ${moduleName} is not a function`)
    }

    return requireFunction
}

const requireModules = (moduleName, callback) => {
    const modelsDirPath = path.join(__dirname, `../../${moduleName}`)

    const modules = fs.readdirSync(modelsDirPath).filter(moduleName => !moduleName.includes('test.js'))

    const requireModule = getRequireFunction(moduleName)

    if (typeof callback === 'function') return callback(modules, moduleName, requireModule)

    return modules.map(module => ({
        name: module.split('.js').join(''),
        initModule: requireModule(module),
    }))
}

const initModule = async (moduleName, config) => {
    const modules = requireModules(moduleName)

    const moduleStatus = Promise.all(
        modules.map(async ({ initModule, name }) => {
            const initStatus = {
                status: 'success',
                message: `${moduleName}: ${name} started successfully`,
            }

            try {
                await initModule(config)
            } catch (err) {
                const message = `${moduleName}.${name} : ${err.message}`

                logger.error(message)

                initStatus.status = 'fail'
                initStatus.message = message
            }

            return initStatus
        })
    )

    return moduleStatus
}

module.exports = {
    initModule,
    requireModules,
    getRequireFunction,
}
