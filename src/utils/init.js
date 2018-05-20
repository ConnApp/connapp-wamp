const modules = [
    rrequire('database'),
]

module.exports = wamp => {
    return Promise.all(
        modules.map(async module => {
            if (typeof module.init !== 'function') {
                throw new Error(`Module ${module.name} does not have a init method!`)
            }

            return module.init(wamp)
        })
    )
}
