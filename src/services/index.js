const wamp = require('connwamp')

const { node } = rrequire('config')

const { listFoldersInDirectory } = rrequire('utils/shared')

const extractService = require('./utils/extractService')
const getServiceMiddleware = require('./utils/getServiceMiddleware')
const runServiceValidators = require('./utils/runServiceValidators')

const servicesList = listFoldersInDirectory(__dirname, [
    'utils',
])

module.exports = async function InitServices() {
    await wamp.register(
        node.registerURI,
        async ({ procedure, payload }) => {
            try {
                const serviceName = extractService(procedure)

                if (!servicesList.includes(serviceName)) {
                    throw new Error(`The service ${serviceName.toUpperCase()} was not declared on this node`)
                }

                const service = require(`./${serviceName}`)()

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
        },
        {
            match: 'wildcard',
            invoke: 'roundrobin',
        }
    )

    setTimeout(async () => {
        await wamp.call(`connapp.alpha.view.${node.name}`, { test: true })
    }, 3000)
}
