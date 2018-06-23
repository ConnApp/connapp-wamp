const wamp = require('connwamp')

module.exports = async function publish({ payload, procedure }, result) {
    if (result.errors && result.errors.length) return result.errors

    await wamp.publish(procedure, payload)

    return result
}
