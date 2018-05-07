const allowedMethods = {
    dispatch: [
        'call',
        'publish',
    ],

    assign: [
        'register',
        'subscribe',
    ],
}

// EXAMPLE

const options = {
    pre() {},

    post() {},
}

subcribeRoute('connapp.route.com', () => {}, options)

module.exports = methodName => routeType => moduleFunction => {
    const exec = moduleFunction(routeType)
}
