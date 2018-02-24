const { initModule } = require('./shared')

module.exports = {
    async init(config) {
        return initModule('watcher', config)
    },
}
