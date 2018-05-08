const successMessage = (methodName, route) => {
    return `${methodName.toUpperCase()} - ${route} assigned successfully`
}
const errorMessage = (methodName, route) => {
    return `${methodName.toUpperCase()} - ${route} assignment failed!`
}

const getMessage = type => (methodName, route) => {
    if (type === 'error') return errorMessage(methodName, route)
    if (type === 'success') return successMessage(methodName, route)
}

const getCallback = status => promise => (methodName, route) => {
    // NOTE Actual function triggered by Wampy events
    return payload => {
        const message = getMessage(status)(methodName, route)

        const info = {
            status,
            message,
            payload,
        }

        return promise(info)
    }
}

module.exports = (resolve, reject) => (methodName, route) => ({
    onError: getCallback('error')(reject)(methodName, route),
    onSuccess: getCallback('success')(resolve)(methodName, route),
})
