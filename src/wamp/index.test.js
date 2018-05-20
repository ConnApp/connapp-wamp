const test = rrequire('test')

test('should not throw error when building importing wamp module', async t => {
    t.notThrows(() => rrequire('wamp'))
})
