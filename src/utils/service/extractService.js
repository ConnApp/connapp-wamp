module.exports = function utils_service_extractService(procedure) {
    return procedure.split('.')[2]
}
