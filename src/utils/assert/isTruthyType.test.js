const test = require('ava')

const isTruthyType = require('./isTruthyType')

test('should get non-empty values correctly [array of mixed types and objects]', async t => {
    const typesArray = [
        {
            type: 'Function',
            value: () => {},
            expectedResult: true,
        },
        {
            type: 'AsyncFunction',
            value: async () => {},
            expectedResult: true,
        },
        {
            type: 'Function',
            value: function() {},
            expectedResult: true,
        },
        {
            type: 'AsyncFunction',
            value: async function() {},
            expectedResult: true,
        },
        {
            type: 'Object',
            value: {},
            expectedResult: false,
        },
        {
            type: 'Object',
            value: { notEmpty: true },
            expectedResult: true,
        },
        {
            type: 'Array',
            value: [],
            expectedResult: false,
        },
        {
            type: 'Array',
            value: [
                true,
            ],
            expectedResult: true,
        },
        {
            type: 'Null',
            value: null,
            expectedResult: false,
        },
        {
            type: 'String',
            value: 'string',
            expectedResult: true,
        },
        {
            type: 'String',
            value: '',
            expectedResult: false,
        },
        {
            type: 'Number',
            value: 0,
            expectedResult: true,
        },
        {
            type: 'Number',
            value: 10,
            expectedResult: true,
        },
        {
            type: 'Boolean',
            value: true,
            expectedResult: true,
        },
        {
            type: 'Boolean',
            value: false,
            expectedResult: false,
        },
        {
            type: 'Undefined',
            value: undefined,
            expectedResult: false,
        },
        {
            type: 'Error',
            value: new Error(),
            expectedResult: true,
        },
        {
            type: 'Promise',
            value: new Promise(() => {}),
            expectedResult: true,
        },
    ]

    for (let type of typesArray) {
        const { type: valueType, value, expectedResult } = type

        const result = isTruthyType(value, valueType)

        t.is(result, expectedResult)
    }
})
