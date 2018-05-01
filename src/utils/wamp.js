const config = require('../config')

const ws = config.websocket.connection

const getMessage = type => (route, task) => {
    if (type === 'error') return errorMessage(route, task)
    if (type === 'success') return successMessage(route, task)
}

const getCallback = status => promise => (task, route) => payload => {
    const message = getMessage(status)(route, task)

    const info = {
        status,
        message,
        payload,
    }

    return promise(info)
}

const onError = getCallback('error')
const onSuccess = getCallback('success')

const dispatchRoute = routeType => (route, payload = {}, options = {}) =>
    new Promise((resolve, reject) => {
        const allowedRouteType = [
            'call',
            'publish',
        ]

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
            throw new Error(errors)
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

const assignRoute = routeType => (route, callback) =>
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
            throw new Error(errors)
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

const successMessage = (route, task) => {
    return `${task.toUpperCase()} - ${route} assigned successfully`
}

const errorMessage = (route, task) => {
    return `${task.toUpperCase()} - ${route} assignment failed!`
}

module.exports = {
    onError,
    onSuccess,
    getMessage,
    assignRoute,
    getCallback,
    errorMessage,
    dispatchRoute,
    successMessage,
    callRoute: dispatchRoute('call'),
    publishRoute: dispatchRoute('publish'),
    registerRoute: assignRoute('register'),
    subscribeRoute: assignRoute('subscribe'),
}
