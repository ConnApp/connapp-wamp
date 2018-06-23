module.exports = function utils_assert_getType(element) {
    const stringifiedElement = Object.prototype.toString.call(element)

    const rawType = stringifiedElement.replace(/(\[|\])/g, '')

    return rawType.split(' ').pop()
}
