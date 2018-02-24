const test = require('ava')

const { initModule, requireModules, getRequireFunction } = require('./shared')

rrequire('utils/init/test')

test('pass', async t => {
    t.pass()
})

test('should get require function correctly', async t => {
    const moduleName = 'models'

    const requireFunction = getRequireFunction(moduleName)

    t.true(requireFunction.toString().includes(moduleName))
})

test('should throw error when no require function is found', async t => {
    const moduleName = 'z'

    const error = t.throws(() => getRequireFunction(moduleName))

    t.is(error.message, `No global require function defined for module ${moduleName}`)
})

test('should throw error when no require function is found', async t => {
    const moduleName = 'a'

    const error = t.throws(() => getRequireFunction(moduleName))

    t.is(error.message, `Global require for ${moduleName} is not a function`)
})

test('should require modules correctly', async t => {
    const moduleName = 'models'

    const modules = requireModules(moduleName)

    modules.forEach(module => {
        t.is(typeof module.name, 'string')
        t.is(typeof module.initModule, 'function')
    })
})

test('should require modules using callback correctly', async t => {
    const moduleName = 'models'

    const callback = (modules, moduleName, requireModule) => {
        return {
            modules,
            moduleName,
            requireModule,
        }
    }

    const callbackReturn = requireModules(moduleName, callback)

    t.is(callbackReturn.moduleName, moduleName)
    t.true(Array.isArray(callbackReturn.modules))
    t.is(typeof callbackReturn.requireModule, 'function')
})

test('should throw error when no require function is found', async t => {
    const moduleName = 'z'

    const error = t.throws(() => requireModules(moduleName))

    t.is(
        error.message,
        `ENOENT: no such file or directory, scandir '/Users/yannunes/projects/connapp-wamp/src/${moduleName}'`
    )
})
