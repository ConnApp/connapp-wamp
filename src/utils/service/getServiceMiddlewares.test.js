const test = require('ava')

const proxyquire = require('proxyquire')
const getType = require('../assert/getType')
const getServiceMiddlewares = require('./getServiceMiddlewares')

test('should throw error [missing service name]', async t => {
    const error = await t.throws(() => getServiceMiddlewares())

    t.is(error.message, 'Missing or invalid service name')
})

test('should throw error [invalid service name]', async t => {
    const error = await t.throws(() => getServiceMiddlewares(10))

    t.is(error.message, 'Missing or invalid service name')
})

test('should return function closured function [first call]', async t => {
    const defineHook = getServiceMiddlewares('save')

    t.is(getType(defineHook), 'Function')
})

test('should throw error [missing hook name]', async t => {
    const defineHook = getServiceMiddlewares('save')

    const error = await t.throws(() => defineHook())

    t.is(error.message, 'Missing or invalid hook name')
})

test('should throw error [invalid hook name]', async t => {
    const defineHook = getServiceMiddlewares('save')

    const error = await t.throws(() => defineHook(10))

    t.is(error.message, 'Missing or invalid hook name')
})

test('should return async function closured function [second call]', async t => {
    const runMiddleware = getServiceMiddlewares('save')('pre')

    t.is(getType(runMiddleware), 'AsyncFunction')
})

test('should return unchanged payload [hook folder not found]', async t => {
    const payload = { true: true }

    const runMiddleware = getServiceMiddlewares('save')('doesNotExist')

    const result = await runMiddleware(payload)

    t.deepEqual(result, payload)
})

test('should return unchanged payload [empty hook folder]', async t => {
    const payload = { true: true }

    const getServiceMiddlewares = proxyquire('./getServiceMiddlewares', { './getMethodsByOperation': () => [] })

    const runMiddleware = getServiceMiddlewares('save')('pre')

    const result = await runMiddleware(payload)

    t.deepEqual(result, payload)
})

test('should return changes payload [valid middleware]', async t => {
    const payload = { true: true }

    const runMiddleware = getServiceMiddlewares('save')('pre')

    const result = await runMiddleware(payload)

    t.notDeepEqual(result, payload)
})
