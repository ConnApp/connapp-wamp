const config = rrequire('config')

const ws = config.websocket.connection

module.exports = async (route, payload = () => {}, callbackObject = {}, options = {}) => {
    // TODO Validate payload

    callbackObject.rpc = payload

    return ws.register(route, callbackObject, options)
}
