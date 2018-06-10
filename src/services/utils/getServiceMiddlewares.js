const fs = require('fs')
const path = require('path')

module.exports = function getServiceMiddlewares(serviceName) {
    return function(hook) {
        return async function({ ...payload }) {
            const middlewaresPath = path.resolve(__dirname, `../../module/middleware/${hook}`)

            const isFolderAndExists =
                fs.existsSync(middlewaresPath) && fs.lstatSync(middlewaresPath).isDirectory()

            if (!isFolderAndExists) return payload

            const middlewareFiles = fs.readdirSync(middlewaresPath)

            if (!middlewareFiles.length) return payload

            for (let middleware of middlewareFiles) {
                const fileService = middleware.split('.')[0]

                if (fileService !== serviceName) continue

                // NOTE Here you are supposed to play with pointers. BE CAREFUL
                await require(`${middlewaresPath}/${middleware}`)(payload)
            }

            return payload
        }
    }
}
