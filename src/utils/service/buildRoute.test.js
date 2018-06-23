const test = require('ava')

const buildRoute = require('./buildRoute')

test('Should build routes correctly, based on arguments [strings and numbers]', async t => {
    const route = buildRoute('this', 1, 'is', 'my', 'route')

    t.is(route, 'this.1.is.my.route')
})
