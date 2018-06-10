const wamp = require('connwamp')

const { node } = rrequire('config')

const { listFoldersInDirectory } = rrequire('utils/shared')

const extractService = require('./utils/extractService')
const getServiceMiddleware = require('./utils/getServiceMiddleware')
const runServiceValidatiors = require('./utils/runServiceValidatiors')

const servicesList = listFoldersInDirectory(__dirname, [
    'utils',
])

module.exports = async function InitServices() {
    await wamp.register(
        node.registerURI,
        async ({ procedure, payload }) => {
            const serviceName = extractService(procedure)

            if (!servicesList.includes(serviceName)) {
                throw new Error(`The service ${serviceName.toUpperCase()} was not declared on this node`)
            }

            const service = require(`./${serviceName}`)
            const runMiddlewares = getServiceMiddleware(serviceName)

            await runServiceValidatiors(serviceName)

            const preMiddlewareResult = await runMiddlewares('pre')(payload)

            const mainResult = await service(preMiddlewareResult, procedure)

            const postMiddlewareResult = await runMiddlewares('post')(mainResult)

            return
        },
        { match: 'wildcard' }
    )

    setTimeout(async () => {
        await wamp.call(`connapp.alpha.view.${node.name}`, { test: true })
    }, 3000)
}
