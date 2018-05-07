const createRoute = require('./creator')
const config = require('../config')
const ws = config.websocket.connection
const { onError, onSuccess } = require('./helper')

const assignFunction = routeType => (route, callback) =>
    new Promise((resolve, reject) => {
        const typeofRoute = typeof route
        const typeofCallback = typeof callback

        const allowedRouteType = [
            'register',
            'subscribe',
        ]

        const errors = []

        if (!allowedRouteType.includes(routeType)) {
            errors.push(
                `Only ${allowedRouteType.join(', and ')} to route are allowed, but you tried to ${routeType}`
            )
        }

        if (typeofCallback !== 'function') {
            errors.push(`Callback should be a function, but got ${typeofCallback}`)
        }

        if (typeofRoute !== 'string') {
            errors.push(`Route should be a string, but got ${typeofRoute}`)
        }

        if (errors.length) {
            throw new Error(errors.join(', '))
        }

        const callbackObject = {
            onError: onError(reject)('subscribe', route),
            onSuccess: onSuccess(resolve)('subscribe', route),
        }

        if (routeType === 'subscribe') {
            callbackObject.onEvent = callback
        }

        if (routeType === 'register') {
            callbackObject.rpc = callback
        }

        ws[routeType](route, callbackObject)
    })

const assignRoute = createRoute('assign')(assignFunction)

module.exports = {
    registerRoute: assignRoute('register'),
    subscribeRoute: assignRoute('subscribe'),
}
