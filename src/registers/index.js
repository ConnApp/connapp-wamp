const { registerRoute } = rrequire('wamp')
const { initModule } = rrequire('utils/shared')

module.exports = {
    name: 'registers',
    init() {
        return initModule('registers', registerRoute)
    },
}
