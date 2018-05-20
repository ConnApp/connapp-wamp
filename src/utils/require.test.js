const test = require('../test')

test('should require file from src folder correctly', async t => {
    try {
        const file = rrequire('utils/shared')

        t.truthy(file)
    } catch (error) {
        t.falsy(error)
    }
})
