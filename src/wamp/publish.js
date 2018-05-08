const config = rrequire('config')

const ws = config.websocket.connection

const publishRoute = async (route, payload = {}, callbackObject = {}, options = {}) => {
    // TODO Validate payload

    return ws.publish(route, payload, callbackObject, options)
}

module.exports = publishRoute
