const path = require('path')

const rootDir = path.join(__dirname, '../')

// For testing only
global.arequire = {}

global.rrequire = function(module) {
    return require(path.join(rootDir, module))
}

global.mrequire = function(modelName) {
    return global.rrequire(path.join('models', modelName))
}

global.wrequire = function(modelName) {
    return global.rrequire(path.join('watchers', modelName))
}
