module.exports = async function utils_extractService(procedure) {
    return procedure.split('.')[2]
}
