const { runServiceValidators, getServiceMiddleware } = require('connutils/src/service')

module.exports = async function register({ procedure, payload }, serviceName, service) {
    try {
        const runMiddlewares = getServiceMiddleware(serviceName)

        const errors = await runServiceValidators(serviceName, payload, procedure)

        if (errors.length) return { errors }

        const preMiddlewareResult = await runMiddlewares('pre')(payload)
        const mainResult = await service(preMiddlewareResult, procedure)
        const postMiddlewareResult = await runMiddlewares('post')(mainResult)

        return postMiddlewareResult
    } catch (error) {
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
