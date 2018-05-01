const test = require('ava')

rrequire('utils/test')

const wsMock = {
    call(route, payload, hashCallbacks) {
        if (payload === 'error') {
            hashCallbacks.onError({ route })
        } else {
            hashCallbacks.onSuccess({ route })
        }

        this.end(route, payload)
    },
    publish(route, payload, hashCallbacks) {
        if (payload === 'error') {
            hashCallbacks.onError({ route })
        } else {
            hashCallbacks.onSuccess({ route })
        }

        this.end(route, payload)
    },
    subscribe(route, hashCallbacks) {
        if (route === 'error') {
            hashCallbacks.onError({ route })
        } else {
            hashCallbacks.onSuccess({ route })
        }

        this.end(route, hashCallbacks)
    },
    register(route, hashCallbacks) {
        if (route === 'error') {
            hashCallbacks.onError({ route })
        } else {
            hashCallbacks.onSuccess({ route })
        }

        this.end(route, hashCallbacks)
    },
    end() {}, // Used to tap into the mock object from the test
}

let connection = { ...wsMock }

const {
    onError,
    onSuccess,
    getMessage,
    getCallback,
    errorMessage,
    successMessage,

    assignRoute,
    dispatchRoute,

    callRoute,
    publishRoute,
    registerRoute,
    subscribeRoute,
} = proxyquire('utils/wamp', { '../config': { websocket: { connection } } })

test('should build onError callback successfully', async t => {
    const task = 'subscribe'
    const route = 'this.is.my.route'
    const callbackPayload = {}

    const callback = () =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                onError(reject)(task, route)(callbackPayload)
            }, 200)
        })

    const { status, message, payload } = await t.throws(callback())

    t.is(status, 'error')
    t.deepEqual(payload, callbackPayload)
    t.is(message, 'SUBSCRIBE - this.is.my.route assignment failed!')
})

test('should build error callback successfully', async t => {
    const task = 'subscribe'
    const route = 'this.is.my.route'
    const callbackPayload = {}

    const callback = () =>
        new Promise((resolve, reject) => {
            setTimeout(() => {
                getCallback('error')(reject)(task, route)(callbackPayload)
            }, 200)
        })

    const { status, message, payload } = await t.throws(callback())

    t.is(status, 'error')
    t.deepEqual(payload, callbackPayload)
    t.is(message, 'SUBSCRIBE - this.is.my.route assignment failed!')
})

test('should build onSuccess callback successfully', async t => {
    const task = 'subscribe'
    const route = 'this.is.my.route'
    const callbackPayload = {}

    const callback = () =>
        new Promise(resolve => {
            setTimeout(() => {
                onSuccess(resolve)(task, route)(callbackPayload)
            }, 200)
        })

    const { status, message, payload } = await callback()

    t.is(status, 'success')
    t.deepEqual(payload, callbackPayload)
    t.is(message, 'SUBSCRIBE - this.is.my.route assigned successfully')
})

test('should build success callback successfully', async t => {
    const task = 'subscribe'
    const route = 'this.is.my.route'
    const callbackPayload = {}

    const callback = () =>
        new Promise(resolve => {
            setTimeout(() => {
                getCallback('success')(resolve)(task, route)(callbackPayload)
            }, 200)
        })

    const { status, message, payload } = await callback()

    t.is(status, 'success')
    t.deepEqual(payload, callbackPayload)
    t.is(message, 'SUBSCRIBE - this.is.my.route assigned successfully')
})

test('should get success message callback successfully', async t => {
    const type = 'success'
    const task = 'subscribe'
    const route = 'this.is.my.route'

    const message = getMessage(type)(task, route)

    t.is(message, 'THIS.IS.MY.ROUTE - subscribe assigned successfully')
})

test('should get success message successfully', async t => {
    const task = 'subscribe'
    const route = 'this.is.my.route'

    const message = successMessage(task, route)

    t.is(message, 'THIS.IS.MY.ROUTE - subscribe assigned successfully')
})

test('should get error message successfully', async t => {
    const task = 'subscribe'
    const route = 'this.is.my.route'

    const message = errorMessage(task, route)

    t.is(message, 'THIS.IS.MY.ROUTE - subscribe assignment failed!')
})

test('shoud return undefined when no message type is passed', async t => {
    const task = 'subscribe'
    const route = 'this.is.my.route'
    const message = getMessage()(task, route)

    t.is(message, undefined)
})

test.cb('should register to route without error', t => {
    t.plan(2)
    const route = 'route'
    const onEvent = () => ({ event: true })

    connection.end = (routeName, hashCallbacks) => {
        t.is(route, routeName)
        t.deepEqual(hashCallbacks.rpc(), onEvent())

        t.end()
    }

    registerRoute(route, onEvent)
})

test('should throw error when second argument is not a function', async t => {
    const route = 'route'

    const error = await t.throws(registerRoute(route, 'string'))

    t.is(error.message, 'Callback should be a function, but got string')
})

test('should throw error when first argument is not a string', async t => {
    const error = await t.throws(registerRoute({}, () => {}))

    t.is(error.message, 'Route should be a string, but got object')
})

test('should throw error when first argument is not a string and second argument is not a function', async t => {
    const error = await t.throws(registerRoute({}, 'asd'))

    t.is(
        error.message,
        'Callback should be a function, but got string,Route should be a string, but got object'
    )
})

test('should throw error when second argument is not a function', async t => {
    const route = 'route'

    const error = await t.throws(subscribeRoute(route, 'string'))

    t.is(error.message, 'Callback should be a function, but got string')
})

test('should throw error when first argument is not a string', async t => {
    const error = await t.throws(subscribeRoute({}, () => {}))

    t.is(error.message, 'Route should be a string, but got object')
})

test('should throw error when first argument is not a string and second argument is not a function', async t => {
    const error = await t.throws(subscribeRoute({}, 'asd'))

    t.is(
        error.message,
        'Callback should be a function, but got string,Route should be a string, but got object'
    )
})

test.cb('should subscribe to route without error', t => {
    t.plan(2)
    const route = 'route'
    const onEvent = () => ({ event: true })

    connection.end = (routeName, hashCallbacks) => {
        t.is(route, routeName)
        t.deepEqual(hashCallbacks.onEvent(), onEvent())

        t.end()
    }

    subscribeRoute(route, onEvent)
})

test.cb('should call to route without error', t => {
    t.plan(2)

    const route = 'route'
    const payload = 'success'

    connection.end = (routeName, routePayload) => {
        t.is(route, routeName)
        t.is(payload, routePayload)

        t.end()
    }

    callRoute(route, payload)
})

test.cb('should publish to route without error', t => {
    t.plan(2)

    const route = 'route'
    const payload = 'success'

    connection.end = (routeName, routePayload) => {
        t.is(route, routeName)
        t.is(payload, routePayload)

        t.end()
    }

    publishRoute(route, payload)
})

test('should return function after route type is passed', async t => {
    const func = assignRoute('subscribe')

    t.is(typeof func, 'function')
})

test('should return promise after route and callback are passed', async t => {
    const promise = assignRoute('subscribe')('route', () => {})

    t.true(promise instanceof Promise)
})

test('should throw error when route type is not allowed', async t => {
    const error = await t.throws(assignRoute('publish')('route', () => {}))

    t.is(error.message, 'Only register, and subscribe to route are allowed, but you tried to publish')
})

test('should throw error when route is not a string', async t => {
    const error = await t.throws(assignRoute('subscribe')({}, () => {}))

    t.is(error.message, 'Route should be a string, but got object')
})

test('should throw error when callback is not a function', async t => {
    const error = await t.throws(assignRoute('subscribe')('route', 'string'))

    t.is(error.message, 'Callback should be a function, but got string')
})

test('should throw error when callback is not a function, should throw error when route is not a string, should throw error when route type is not allowed', async t => {
    const error = await t.throws(assignRoute('publish')({}, 'string'))

    t.is(
        error.message,
        'Only register, and subscribe to route are allowed, but you tried to publish,Callback should be a function, but got string,Route should be a string, but got object'
    )
})

test('should return function after route type is passed', async t => {
    const func = dispatchRoute('publish')

    t.is(typeof func, 'function')
})

test('should return promise after route and payload are passed', async t => {
    const promise = dispatchRoute('publish')('route', {})

    t.true(promise instanceof Promise)
})

test('should throw error when route type is not allowed', async t => {
    const error = await t.throws(dispatchRoute('subscribe')('route', {}))

    t.is(error.message, 'Only call, and publish to route are allowed, but you tried to subscribe')
})

test('should throw error when route is not a string', async t => {
    const error = await t.throws(dispatchRoute('publish')({}, {}))

    t.is(error.message, 'Route should be a string, but got object')
})

test('should throw error when payload is a function', async t => {
    const error = await t.throws(dispatchRoute('publish')('route', () => {}))

    t.is(error.message, 'Payload can not be a function')
})

test('should throw error when callback is not a function, should throw error when route is not a string, should throw error when route type is not allowed', async t => {
    const error = await t.throws(dispatchRoute('subscribe')({}, () => {}))

    t.is(
        error.message,
        'Only call, and publish to route are allowed, but you tried to subscribe,Route should be a string, but got object,Payload can not be a function'
    )
})
