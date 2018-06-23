const test = require('ava')

const extractService = require('./extractService')

test('extractService tests', async t => {
    const sampleServiceRoute = 'connapp.alpha.save.events'

    const serviceName = extractService(sampleServiceRoute)

    t.is(serviceName, 'save')
})
