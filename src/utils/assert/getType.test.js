const test = require('ava')

const getType = require('./getType')

test('should get types correctly [Mixed arrays of all possible types]', async t => {
    const elements = [
        {
            value: () => {},
            expectedResult: 'Function',
        },
        {
            value: async () => {},
            expectedResult: 'AsyncFunction',
        },
        {
            value: function() {},
            expectedResult: 'Function',
        },
        {
            value: async function() {},
            expectedResult: 'AsyncFunction',
        },
        {
            value: {},
            expectedResult: 'Object',
        },
        {
            value: [],
            expectedResult: 'Array',
        },
        {
            value: null,
            expectedResult: 'Null',
        },
        {
            value: 'string',
            expectedResult: 'String',
        },
        {
            value: 0,
            expectedResult: 'Number',
        },
        {
            value: 10,
            expectedResult: 'Number',
        },
        {
            value: true,
            expectedResult: 'Boolean',
        },
        {
            value: false,
            expectedResult: 'Boolean',
        },
        {
            value: undefined,
            expectedResult: 'Undefined',
        },
        {
            value: new Error(),
            expectedResult: 'Error',
        },
        {
            value: new Promise(() => {}),
            expectedResult: 'Promise',
        },
    ]

    for (let element of elements) {
        const { expectedResult, value } = element

        const result = getType(value)

        t.is(result, expectedResult)
    }
})
