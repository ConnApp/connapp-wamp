const test = require('ava')

const isFunction = require('./isFunction')

test('should return true on functions [Mixed arrays of all possible types]', async t => {
    const elements = [
        {
            expectedResult: true,
            value: () => {},
        },
        {
            expectedResult: true,
            value: async () => {},
        },
        {
            expectedResult: true,
            value: function() {},
        },
        {
            expectedResult: true,
            value: async function() {},
        },
        {
            expectedResult: false,
            value: {},
        },
        {
            expectedResult: false,
            value: [],
        },
        {
            expectedResult: false,
            value: null,
        },
        {
            expectedResult: false,
            value: 'string',
        },
        {
            expectedResult: false,
            value: 0,
        },
        {
            expectedResult: false,
            value: 10,
        },
        {
            expectedResult: false,
            value: true,
        },
        {
            expectedResult: false,
            value: false,
        },
        {
            expectedResult: false,
            value: new Error(),
        },
        {
            expectedResult: false,
            value: new Promise(() => {}),
        },
    ]

    for (let element of elements) {
        const { expectedResult, value } = element

        const result = isFunction(value)

        t.is(result, expectedResult)
    }
})
