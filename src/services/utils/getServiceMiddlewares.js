const fs = require('fs')
const path = require('path')
const { getMethodsByOperations } = rrequire('utils/shared')

module.exports = function getServiceMiddlewares(serviceName) {
    return function(hook) {
        return async function runMiddlewares({ ...payload }) {
            const middlewaresPath = path.resolve(__dirname, `../../module/middleware/${hook}`)

            const isFolderAndExists =
                fs.existsSync(middlewaresPath) && fs.lstatSync(middlewaresPath).isDirectory()

            if (!isFolderAndExists) return payload

            const middlewareFiles = getMethodsByOperations(serviceName, middlewaresPath)

            if (!middlewareFiles.length) return payload

            for (let middleware of middlewareFiles) {
                // NOTE Here you are supposed to play with pointers. BE CAREFUL
                await require(`${middlewaresPath}/${middleware}`)(payload)
            }

            return payload
        }
    }
}
