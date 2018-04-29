const path = require('path')

// For testing only
global.arequire = {}

global.src_path = path.join(__dirname, '../')

global.rrequire = function(module) {
    return require(path.join(global.src_path, module))
}

global.mrequire = function(modelName) {
    return global.rrequire(path.join('models', modelName))
}

global.wrequire = function(modelName) {
    return global.rrequire(path.join('watchers', modelName))
}
