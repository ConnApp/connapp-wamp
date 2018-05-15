const { isFunction } = rrequire('utils/shared')
const buildCallbacks = rrequire('wamp/callbacks')

const getMethod = methodName => {
    let method
    // TODO Validate Method Name
    try {
        if (!methodName) throw Error('No method type')

        method = rrequire(`wamp/${methodName}`)
    } catch (error) {
        throw error
    }

    return method
}

// TODO Test this
const callbackWrapper = (callback, { pre, post } = {}) => {
    return async function() {
        const functionArguments = { ...arguments }

        // TODO Pre and Post Hooks
        // NOTE Maybe use async pipeline. Not sure yet

        // let preResult
        // let postResult

        if (isFunction(pre)) {
            // preResult = await pre(functionArguments)
        }

        const mainResult = await callback.apply(null, functionArguments)

        if (isFunction(post)) {
            // postResult = await post.call((functionArguments, mainResult, preResult))
        }

        return mainResult
    }
}

const methodWrapper = methodName => (route, payload, { pre, post, ...options }) =>
    new Promise((resolve, reject) => {
        {
            // TODO Validate methodName and Routes
            try {
                const method = getMethod(methodName) // NOTE Might throw error
                const callbacks = buildCallbacks(resolve, reject)(methodName, route)

                if (isFunction(payload)) {
                    payload = callbackWrapper(payload, {
                        pre,
                        post,
                    })
                }

                return method(route, payload, callbacks, options) // NOTE Might throw error
            } catch (error) {
                reject(error)
            }
        }
    })

module.exports = { methodWrapper }
