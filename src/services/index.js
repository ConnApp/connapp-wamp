const wamp = require('connwamp')
const crudOperations = require('connwamp-crud')
const publishCallback = require('./_operations/publish')
const registerCallback = require('./_operations/register')

const { node } = require('../config')
const { extractService } = require('connutils/src/service')
const { listFolders } = require('connutils/src/fs')

const servicesList = listFolders(__dirname, [
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

    return registerStatus
}
