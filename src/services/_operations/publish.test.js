const test = require('ava')

const publish = require('./publish')
const proxyquire = require('proxyquire')

test('should return error and not publish [callback with errors]', async t => {
    const result = {
        errors: [
            { error: true },
        ],
    }

    const publishResult = await publish({}, result)

    t.deepEqual(publishResult, result.errors)
})

test.cb('should publish correctly', t => {
    const result = {}

    const publish = proxyquire('./publish', { connwamp: { publish() {} } })

    publish({}, result).then(publishResult => {
        t.deepEqual(publishResult, result)

        t.end()
    })
})
