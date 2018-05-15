const { methodWrapper } = require('./methods/wamp')

const { readFileInDir } = rrequire('utils/shared')

const allowedNames = [
    'call',
    'subscribe',
    'publish',
    'register',
]

const buildMethods = () =>
    readFileInDir(__dirname).reduce((methods, name) => {
        if (!methods[name] && allowedNames.includes(name)) {
            methods[name] = methodWrapper(name)
        }

        return methods
    }, {})

module.exports = buildMethods()
