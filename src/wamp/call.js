const config = rrequire('config')

const ws = config.websocket.connection

module.exports = async (route, payload = {}, callbackObject = {}, options = {}) => {
    // TODO Validate payload

    return ws.call(route, payload, callbackObject, options)
}
