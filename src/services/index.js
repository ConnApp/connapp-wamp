const wamp = require('connwamp')
const crudOperations = require('connwamp-crud')
const publishCallback = require('./utils/operations/publish')
const registerCallback = require('./utils/operations/register')

const { node } = rrequire('config')
const extractService = rrequire('utils/extractService')
const { listFoldersInDirectory } = rrequire('utils/shared')

const servicesList = listFoldersInDirectory(__dirname, [
    '_operations',
]).concat(Object.keys(crudOperations))

module.exports = async function InitService() {
    const registerStatus = await wamp.register(
        node.registerURI,
        function({ payload, procedure }) {
            const serviceName = extractService(procedure)

            if (!servicesList.includes(serviceName)) {
                throw new Error(`The service ${serviceName.toUpperCase()} was not declared on this node`)
            }

            const service = crudOperations[serviceName] || require(`./${serviceName}`)

            return registerCallback(
                {
                    payload,
                    procedure,
                },
                service,
                serviceName
            )
        },
        {
            match: 'wildcard',
            invoke: 'roundrobin',
            post: publishCallback,
        }
    )

    console.log(registerStatus)

    return registerStatus
}
