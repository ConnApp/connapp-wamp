const getType = require('./getType')

module.exports = function utils_assert_isTruthyType(element, type) {
    if (!type || getType(type) !== 'String') throw new Error('Misisng or invalid type argument')

    if (!element && element !== 0) return false

    const elementType = getType(element)

    if ([
        'Array',
        'Object',
    ].includes(elementType)) {
        const elementLength = Object.keys(element).length

        if (!elementLength) return false
    }

    return elementType === type
}
