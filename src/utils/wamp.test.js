const test = require('ava')

rrequire('utils/test')

const wsMock = {
    subscribe(route, options) {},
    call() {},
    publish() {},
    register() {},
}

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
} = proxyquire('utils/wamp', { '../config': { websocket: { connection: wsMock } } })

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
        new Promise((resolve, reject) => {
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
        new Promise((resolve, reject) => {
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

test.cb('should subscribe to routes witout error', t => {
    t.plan(1)

    wsMock.subscribe = () => {
        t.pass()
        t.end()
    }

    subscribeRoute('route', () => {})
})
