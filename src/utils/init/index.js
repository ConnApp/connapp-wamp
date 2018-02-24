const modules = [
    require('./database'),
    require('./watchers'),
]

module.exports = async config => {
    return Promise.all(modules.map(module => module.init(config)))
}
