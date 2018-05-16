const test = require('ava')
const path = require('path')

rrequire('utils/test')

const { initModule, isFunction, buildRoute, readFileInDir, requireModules } = rrequire('utils/shared')

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

test('should test if is function correctly', async t => {
    const tests = [
        () => {},
        async () => {},
        function() {},
        async function() {},
        {},
        [],
        null,
        'string',
        0,
        10,
        true,
        false,
    ]

    const expectedResult = [
        true,
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
    ]

    const result = tests.map(isFunction)

    t.deepEqual(expectedResult, result)
})

test('should read files in a directory correctly and not read test files', async t => {
    const expectedResult = [
        'init',
        'require',
        'shared',
        'test',
    ]

    const dirFiles = readFileInDir(__dirname)

    t.deepEqual(expectedResult, dirFiles)
})
