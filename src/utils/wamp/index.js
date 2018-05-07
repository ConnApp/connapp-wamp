const assign = require('./assign')
const dispatch = require('./dispatch')

module.exports = {
    registerRoute: assign('register'),
    subscribeRoute: assign('subscribe'),

    callRoute: dispatch('call'),
    publishRoute: dispatch('publish'),
}
