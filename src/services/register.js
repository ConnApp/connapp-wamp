const extractService = require('./utils/extractService')
const getServiceMiddleware = require('./utils/getServiceMiddlewares')
const runServiceValidators = require('./utils/runServiceValidators')

const { listFoldersInDirectory } = rrequire('utils/shared')

const servicesList = listFoldersInDirectory(__dirname, [
    'utils',
])

module.exports = async function register({ procedure, payload }) {
    try {
        const serviceName = extractService(procedure)

        if (!servicesList.includes(serviceName)) {
            throw new Error(`The service ${serviceName.toUpperCase()} was not declared on this node`)
        }

        const service = require(`./${serviceName}`)() // Executes first to verify scopes and stuff

        const runMiddlewares = getServiceMiddleware(serviceName)

        const errors = await runServiceValidators(serviceName, payload, procedure)

        if (errors.lenth) return { errors }

        const preMiddlewareResult = await runMiddlewares('pre')(payload)
        const mainResult = await service(preMiddlewareResult, procedure)
        const postMiddlewareResult = await runMiddlewares('post')(mainResult)

        return postMiddlewareResult
    } catch (error) {
        console.log(error)

        return {
            errors: [
                {
                    procedure,
                    reason: error.message,
                    validator: error.stack
                        .split('\n')[1]
                        .trim()
                        .split(' ')[1],
                },
            ],
        }
    }
}
