const fs = require('fs')
const path = require('path')
const logger = require('loglevel')

const getRequireFunction = module => {
    const prefix = module[0].toLowerCase()

    const requireFunction = global[prefix + 'require']

    if (!requireFunction) {
        throw new Error(`No global required defined for module ${module}`)
    }

    if (typeof requireFunction !== 'function') {
        throw new Error(`Global require for ${module} is not a function`)
    }

    return requireFunction
}

const requireModules = (moduleName, callback) => {
    const modelsDirPath = path.join(__dirname, `../../${moduleName}`)

    const modules = fs.readdirSync(modelsDirPath)

    const requireModule = getRequireFunction(moduleName)

    if (typeof callback !== 'function') {
        return modules.map(module => ({
            name: module,
            initModule: requireModule(module),
        }))
    }

    return callback(modules, moduleName)
}

const initModule = (moduleName, config) => {
    const modules = requireModules(moduleName)

    const moduleStatus = modules.map(async ({ initModule, name }) => {
        const initStatus = {
            status: 'success',
            message: `${moduleName}: ${name} started successfully`,
        }

        try {
            await initModule(config)
        } catch (err) {
            logger.error(err)

            initStatus.status = 'error'

            initStatus.message = err.message
        }

        return initStatus
    })

    return moduleStatus
}

module.exports = {
    initModule,
    requireModules,
    getRequireFunction,
}
