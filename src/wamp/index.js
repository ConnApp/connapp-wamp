const { wamp } = rrequire('config')
const { buildMethods } = require('./methods/wamp')

module.exports = buildMethods(wamp)
