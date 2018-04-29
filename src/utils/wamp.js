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
