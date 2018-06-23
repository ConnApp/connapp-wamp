const getType = require('./getType')

module.exports = function utils_assert_isFunction(element) {
    return [
        'Function',
        'AsyncFunction',
    ].includes(getType(element))
}
