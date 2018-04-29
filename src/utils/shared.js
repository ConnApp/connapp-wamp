const fs = require('fs')
const path = require('path')
const logger = require('loglevel')
const toSlugCase = require('to-slug-case')

function buildRoute() {
    return [
        ...arguments,
    ].join('.')
}

const requireModules = moduleName => {
    const modelsDirPath = path.join(src_path, moduleName)

    const modules = fs
        .readdirSync(modelsDirPath)
        .filter(moduleName => !moduleName.includes('test.js') && !moduleName.includes('index.js'))

    return modules.map(module => ({
        name: module.split('.js').join(''),
        routes: rrequire(`${moduleName}/${module}`),
    }))
}

const initModule = async (moduleName, customInitProcedure) => {
    const result = []
    const modules = requireModules(moduleName)

    for (let module of modules) {
        const { name, routes } = module
        const uppercaseModuleName = moduleName.toUpperCase()

        const initStatus = {
            status: 'success',
            module: moduleName,
            message: `${uppercaseModuleName}: ${name} started successfully`,
        }

        try {
            for (let route in routes) {
                const procedure = routes[route]
                const normalizedRouteName = toSlugCase(route)
                const fullRoute = buildRoute('connapp', name, normalizedRouteName)

                await customInitProcedure(fullRoute, procedure)
            }
        } catch (error) {
            const message = `${uppercaseModuleName}.${name}: ${error.message}`

            logger.error(message)

            initStatus.status = 'error'
            initStatus.message = message
        }

        result.push(initStatus)
    }

    return result
}

module.exports = {
    initModule,
    buildRoute,
    requireModules,
}
