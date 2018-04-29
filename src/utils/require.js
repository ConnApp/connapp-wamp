const path = require('path')
const proxy = require('proxyquire')

// For testing only
global.arequire = {}

global.src_path = path.join(__dirname, '../')

global.rrequire = function(module) {
    const modulePath = path.join(global.src_path, module)

    return require(modulePath)
}

global.proxyquire = function(module, object) {
    const modulePath = path.join(global.src_path, module)

    return proxy(modulePath, object)
}
