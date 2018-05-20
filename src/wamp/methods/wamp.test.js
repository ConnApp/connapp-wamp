const test = rrequire('test')

const { getObjectType } = rrequire('utils/shared')
const { getMethod, methodWrapper, callbackWrapper } = require('./wamp')

const methods = [
    'call',
    'publish',
    'register',
    'subscribe',
]

test('should get methods correctly', async t => {
    for (let method of methods) {
        const mthd = getMethod(method)

        t.is(getObjectType(mthd), 'Function')
    }
})

test('should wrap callback with pre and post hooks correctly', async t => {
    const hooks = {
        pre(test, test2) {
            t.is(test, 1)
            t.is(test2, 2)
            return { fromPre: true }
        },
        post(test, test2, preResult, mainResult) {
            t.is(test, 1)
            t.is(test2, 2)
            t.true(preResult.fromPre)
            t.true(mainResult.fromMain)
            t.is(mainResult.result, 3)
        },
    }

    const callback = async (test, test2, preResult) => {
        t.true(preResult.fromPre)
        return {
            fromMain: true,
            result: test + test2,
        }
    }

    const wrappedCallback = callbackWrapper(callback, hooks)

    wrappedCallback(1, 2)
})

test('should wrap callback with only post hook correctly', async t => {
    const hooks = {
        post(test, test2, preResult, mainResult) {
            t.is(test, 1)
            t.is(test2, 2)
            t.deepEqual(preResult, {})
            t.true(mainResult.fromMain)
            t.is(mainResult.result, 3)
        },
    }

    const callback = async (test, test2, preResult) => {
        t.deepEqual(preResult, {})
        return {
            fromMain: true,
            result: test + test2,
        }
    }

    const wrappedCallback = callbackWrapper(callback, hooks)

    wrappedCallback(1, 2)
})

test('should wrap callback with only pre-hook correctly', async t => {
    const hooks = {
        pre(test, test2) {
            t.is(test, 1)
            t.is(test2, 2)
            return { fromPre: true }
        },
    }

    const callback = async (test, test2, preResult) => {
        t.true(preResult.fromPre)
        return {
            fromMain: true,
            result: test + test2,
        }
    }

    const wrappedCallback = callbackWrapper(callback, hooks)

    wrappedCallback(1, 2)
})

test('should wrap register method correctly with the right options', async t => {
    t.plan(7)

    const options = {
        other: true,
        pre(payload) {
            t.true(payload.objectFromCall)

            return { fromPre: true }
        },
        post(payload, preResult, mainResult) {
            t.true(preResult.fromPre)
            t.true(payload.objectFromCall)
            t.true(mainResult.hasBeenDone)
        },
    }

    const wampMock = {
        async register(route, callbacks, options) {
            t.true(options.other)

            callbacks.onSuccess(true)
            callbacks.rpc({ objectFromCall: true })
        },
    }

    const method = methodWrapper('register')(wampMock)

    const response = await method(
        'test',
        payload => {
            t.true(payload.objectFromCall)

            return { hasBeenDone: true }
        },
        options
    )

    const expectedResponse = {
        payload: true,
        status: 'success',
        message: 'REGISTER - test assigned successfully',
    }

    t.deepEqual(response, expectedResponse)
})

test('should fail to wrap register method when an error occurs', async t => {
    t.plan(3)

    const options = { other: true }

    const wampMock = {
        async register(route, callbacks, options) {
            t.true(options.other)
            callbacks.onError(true)
        },
    }

    const method = methodWrapper('register')(wampMock)

    const error = await t.throws(
        method(
            'test',
            () => {
                t.fail() // Not being called

                return { hasBeenDone: true }
            },
            options
        )
    )

    const expectedResponse = {
        payload: true,
        status: 'error',
        message: 'REGISTER - test assignment failed!',
    }

    t.deepEqual(error, expectedResponse)
})

test('should wrap subscribe method correctly with the right options', async t => {
    t.plan(7)

    const options = {
        other: true,
        pre(payload) {
            t.true(payload.objectFromCall)

            return { fromPre: true }
        },
        post(payload, preResult, mainResult) {
            t.true(preResult.fromPre)
            t.true(payload.objectFromCall)
            t.true(mainResult.hasBeenDone)
        },
    }

    const wampMock = {
        async subscribe(route, callbacks, options) {
            t.true(options.other)
            callbacks.onSuccess(true)
            callbacks.onEvent({ objectFromCall: true })
        },
    }

    const method = methodWrapper('subscribe')(wampMock)

    const response = await method(
        'test',
        payload => {
            t.true(payload.objectFromCall)

            return { hasBeenDone: true }
        },
        options
    )

    const expectedResponse = {
        payload: true,
        status: 'success',
        message: 'SUBSCRIBE - test assigned successfully',
    }

    t.deepEqual(response, expectedResponse)
})

test('should fail to wrap subscribe method when an error occurs', async t => {
    t.plan(3)

    const options = { other: true }

    const wampMock = {
        async subscribe(route, callbacks, options) {
            t.true(options.other)
            callbacks.onError(true)
        },
    }

    const method = methodWrapper('subscribe')(wampMock)

    const error = await t.throws(
        method(
            'test',
            () => {
                t.fail() // Not being called

                return { hasBeenDone: true }
            },
            options
        )
    )

    const expectedResponse = {
        payload: true,
        status: 'error',
        message: 'SUBSCRIBE - test assignment failed!',
    }

    t.deepEqual(error, expectedResponse)
})

test('should wrap call method correctly with the right options', async t => {
    t.plan(3)

    const options = {
        other: true,
        pre() {
            t.fail() // Is Not called
        },
        post() {
            t.fail() // Is Not called
        },
    }

    const wampMock = {
        async call(route, payload, callbacks, options) {
            t.true(options.other)
            t.true(payload.isPayload)

            callbacks.onSuccess(true)
        },
    }

    const method = methodWrapper('call')(wampMock)

    const response = await method('test', { isPayload: true }, options)

    const expectedResponse = {
        payload: true,
        status: 'success',
        message: 'CALL - test assigned successfully',
    }

    t.deepEqual(response, expectedResponse)
})

test('should failt to wrap call method when an error occurs', async t => {
    t.plan(4)

    const options = {
        other: true,
        pre() {
            t.fail() // Is Not called
        },
        post() {
            t.fail() // Is Not called
        },
    }

    const wampMock = {
        async call(route, payload, callbacks, options) {
            t.true(options.other)
            t.true(payload.isPayload)

            callbacks.onError(true)
        },
    }

    const method = methodWrapper('call')(wampMock)

    const error = await t.throws(method('test', { isPayload: true }, options))

    const expectedResponse = {
        payload: true,
        status: 'error',
        message: 'CALL - test assignment failed!',
    }

    t.deepEqual(error, expectedResponse)
})

test('should wrap publish method correctly with the right options', async t => {
    t.plan(3)

    const options = {
        other: true,
        pre() {
            t.fail() // Is Not called
        },
        post() {
            t.fail() // Is Not called
        },
    }

    const wampMock = {
        async publish(route, payload, callbacks, options) {
            t.true(options.other)
            t.true(payload.isPayload)

            callbacks.onSuccess(true)
        },
    }

    const method = methodWrapper('publish')(wampMock)

    const response = await method('test', { isPayload: true }, options)

    const expectedResponse = {
        payload: true,
        status: 'success',
        message: 'PUBLISH - test assigned successfully',
    }

    t.deepEqual(response, expectedResponse)
})

test('should failt to wrap call method when an error occurs', async t => {
    t.plan(4)

    const options = {
        other: true,
        pre() {
            t.fail() // Is Not called
        },
        post() {
            t.fail() // Is Not called
        },
    }

    const wampMock = {
        async publish(route, payload, callbacks, options) {
            t.true(options.other)
            t.true(payload.isPayload)

            callbacks.onError(true)
        },
    }

    const method = methodWrapper('publish')(wampMock)

    const error = await t.throws(method('test', { isPayload: true }, options))

    const expectedResponse = {
        payload: true,
        status: 'error',
        message: 'PUBLISH - test assignment failed!',
    }

    t.deepEqual(error, expectedResponse)
})
