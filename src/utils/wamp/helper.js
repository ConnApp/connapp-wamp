const successMessage = (route, task) => {
    return `${task.toUpperCase()} - ${route} assigned successfully`
}

const errorMessage = (route, task) => {
    return `${task.toUpperCase()} - ${route} assignment failed!`
}

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

module.exports = {
    getMessage,
    getCallback,
    errorMessage,
    successMessage,
    onError: getCallback('error'),
    onSuccess: getCallback('success'),
}
