const test = require('ava')

rrequire('utils/test')

const { initModule, buildRoute, requireModules } = rrequire('utils/shared')

test('should require modules correctly', async t => {
    const moduleName = 'registers'

    const modules = requireModules(moduleName)

    modules.forEach(module => {
        t.is(typeof module.name, 'string')
        t.is(typeof module.routes, 'object')
    })
})

test('should throw error when no require function is found', async t => {
    const moduleName = 'z'

    const error = t.throws(() => requireModules(moduleName))

    t.is(
        error.message,
        `ENOENT: no such file or directory, scandir '/Users/yannunes/projects/connapp/connapp-wamp/src/${moduleName}'`
    )
})

test('should init registers module without error', async t => {
    const moduleName = 'registers'

    const moduleResult = await initModule(moduleName, () => {})

    t.truthy(moduleResult.length)
    t.is(moduleResult[0].status, 'success')
    t.is(moduleResult[0].module, moduleName)
    t.is(moduleResult[0].message, 'REGISTERS: auth started successfully')
})

test('should build route correctly', async t => {
    const expectedResult = '1.2.3.myroute.5'

    const route = buildRoute(1, 2, 3, 'myroute', 5)

    t.is(route, expectedResult)
})
