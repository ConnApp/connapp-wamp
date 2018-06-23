const test = require('ava')

const proxyquire = require('proxyquire')

/*
    const runServiceValidators = require('../../utils/service/runServiceValidators')
    const getServiceMiddleware = require('../../utils/service/getServiceMiddlewares')
*/

test('should return errors [error thrown on external function]', async t => {
    const register = proxyquire('./register', {
        '../../utils/service/runServiceValidators': () => [],
        '../../utils/service/getServiceMiddlewares': function getServiceMiddleware() {
            throw new Error('This is a reason')
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
        '../../utils/service/runServiceValidators': () => [
            { error: true },
        ],
        '../../utils/service/getServiceMiddlewares': () => {},
    })

    const result = await register({})

    t.deepEqual(result.errors, [
        { error: true },
    ])
})
