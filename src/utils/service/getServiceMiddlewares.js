const fs = require('fs')
const path = require('path')

const isTruthyType = require('../assert/isTruthyType')

const getMethodsByOperation = require('./getMethodsByOperation')

module.exports = function utils_service_getServiceMiddlewares(serviceName) {
    if (!isTruthyType(serviceName, 'String')) {
        throw new Error('Missing or invalid service name')
    }

    return function utils_service_defineMiddlewareHook(hook) {
        if (!isTruthyType(hook, 'String')) {
            throw new Error('Missing or invalid hook name')
        }

        return async function utils_service_runMiddlewares({ ...payload }) {
            const middlewaresPath = path.resolve(__dirname, `../../module/middlewares/${hook}`)

            const exists = fs.existsSync(middlewaresPath)
            const isFolder = exists && fs.lstatSync(middlewaresPath).isDirectory()

            if (!isFolder) return payload

            const middlewareFiles = getMethodsByOperation(middlewaresPath, serviceName)

            if (!middlewareFiles.length) return payload

            for (let middleware of middlewareFiles) {
                // NOTE Here you are supposed to play with pointers. BE CAREFUL

                const middlewareFullPath = `${middlewaresPath}/${middleware}`

                await require(middlewareFullPath)(payload)
            }

            return payload
        }
    }
}
