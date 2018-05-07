const config = require('../config')
const ws = config.websocket.connection
const createRoute = require('./creator')
const { onError, onSuccess } = require('./helper')

const dispatch = routeType => (route, payload = {}, options = {}) =>
    new Promise((resolve, reject) => {
        // Validate rote
        const allowedRouteType = []

        const typeofRoute = typeof route
        const typeofPayload = typeof payload

        const errors = []

        if (!allowedRouteType.includes(routeType)) {
            errors.push(
                `Only ${allowedRouteType.join(', and ')} to route are allowed, but you tried to ${routeType}`
            )
        }

        if (typeofRoute !== 'string') {
            errors.push(`Route should be a string, but got ${typeofRoute}`)
        }

        if (typeofPayload === 'function') {
            errors.push('Payload can not be a function')
        }

        if (errors.length) {
            throw new Error(errors.join(', '))
        }

        ws[routeType](
            route,
            payload,
            {
                onError: onError(reject)(routeType, route),
                onSuccess: onSuccess(resolve)(routeType, route),
            },
            options
        )
    })

module.exports = {
    dispatchRoute,
    callRoute: dispatchRoute('call'),
    publishRoute: dispatchRoute('publish'),
}
