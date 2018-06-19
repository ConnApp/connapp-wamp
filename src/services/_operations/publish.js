module.exports = async function publish({ payload, procedure }, result) {
    if (result.errors && result.errors.length) return result.errors

    // TODO Publish event route here.

    return result
}
