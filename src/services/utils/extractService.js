module.exports = async function extractService(procedure) {
    return procedure.split('.')[2]
}
