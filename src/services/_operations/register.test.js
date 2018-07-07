const test = require('ava')

const proxyquire = require('proxyquire')

test('should return errors [error thrown on external function]', async t => {
    const register = proxyquire('./register', {
        'connutils/src/service': {
            runServiceValidators: () => [],
            getServiceMiddleware: function getServiceMiddleware() {
                throw new Error('This is a reason')
            },
        },
    })

    const result = await register({ procedure: 'procedure' })

    const expectedResult = {
        errors: [
            {
                procedure: 'procedure',
                reason: 'This is a reason',
                validator: 'getServiceMiddleware',
            },
        ],
    }

    t.deepEqual(result, expectedResult)
})

test('should return errors [errors on validation]', async t => {
    const register = proxyquire('./register', {
        'connutils/src/service': {
            runServiceValidators: () => [
                { error: true },
            ],
            getServiceMiddleware: () => {},
        },
    })

    const result = await register({})

    t.deepEqual(result.errors, [
        { error: true },
    ])
})
