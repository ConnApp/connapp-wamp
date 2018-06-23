const test = require('ava')

const proxyquire = require('proxyquire')

test('should return no errors payload [validator folder not found]', async t => {
    const payload = { true: true }

    const runServiceValidators = proxyquire('./runServiceValidators', { fs: { existsSync: () => false } })

    const result = await runServiceValidators('does_not_exists', payload, 'procedure')

    t.deepEqual(result, [])
})

test('should return unchanged payload [empty hook folder]', async t => {
    const payload = { true: true }

    const runServiceValidators = proxyquire('./runServiceValidators', { './getMethodsByOperation': () => [] })

    const result = await runServiceValidators('save', payload, 'procedure')

    t.deepEqual(result, [])
})

test.todo('Validator errors return error')
