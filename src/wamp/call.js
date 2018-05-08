const config = rrequire('config')

const ws = config.websocket.connection

const callRoute = async (route, payload = {}, callbackObject = {}, options = {}) => {
    // TODO Validate payload

    return ws.call(route, payload, callbackObject, options)
}

module.exports = callRoute
