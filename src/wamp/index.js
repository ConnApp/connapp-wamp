const { methodWrapper } = require('./methods/wamp')

const { wamp } = rrequire('config')
const { readFileInDir } = rrequire('utils/shared')

const allowedNames = [
    'call',
    'publish',
    'register',
    'subscribe',
]

const buildMethods = () =>
    readFileInDir(__dirname).reduce((methods, name) => {
        if (!methods[name] && allowedNames.includes(name)) {
            methods[name] = methodWrapper(name)(wamp)
        }

        return methods
    }, {})

module.exports = buildMethods()
