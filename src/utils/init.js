const modules = [
    rrequire('database'),
]

module.exports = async wamp => {
    const result = []

    for (let module of modules) {
        if (typeof module.init !== 'function') {
            throw new Error(`Module ${module.name} does not have a init method!`)
        }

        const initResult = await module.init(wamp)

        result.push(initResult)
    }

    return result
}
