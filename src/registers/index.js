const { initModule } = rrequire('utils/shared')
const { registerRoute } = rrequire('utils/wamp')

module.exports = {
    name: 'registers',
    init() {
        return initModule('registers', registerRoute)
    },
}
