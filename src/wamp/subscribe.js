const config = rrequire('config')

const ws = config.websocket.connection

module.exports = async (route, payload = () => {}, callbackObject = {}, options = {}) => {
    // TODO Validate payload

    callbackObject.onEvent = payload

    return ws.subscribe(route, callbackObject, options)
}
