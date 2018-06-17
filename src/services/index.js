const wamp = require('connwamp')

const { node } = rrequire('config')

const publishCallback = require('./publish')
const registerCallback = require('./register')

module.exports = async function InitService() {
    const registerStatus = await wamp.register(node.registerURI, registerCallback, {
        match: 'wildcard',
        invoke: 'roundrobin',
        post: publishCallback,
    })

    console.log(registerStatus)

    return registerStatus
}
