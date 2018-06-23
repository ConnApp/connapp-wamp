const fs = require('fs')
const path = require('path')

const getMethodsByOperation = require('./getMethodsByOperation')

module.exports = async function utils_service_runServiceValidators(serviceName, payload, procedure) {
    const errors = []

    const validatorsPath = path.resolve(__dirname, '../../module/validators')

    const exists = fs.existsSync(validatorsPath)
    const isFolder = exists && fs.lstatSync(validatorsPath).isDirectory()

    if (!isFolder) return errors

    const validatorFiles = getMethodsByOperation(serviceName, validatorsPath)

    if (!validatorFiles.length) return errors

    for (let validator of validatorFiles) {
        const validatorFunction = require(`${validatorsPath}/${validator}`)

        try {
            await validatorFunction({ ...payload })
        } catch (error) {
            errors.push({
                procedure,
                reason: error.message,
                validator: validatorFunction.name,
            })
        }
    }

    return errors
}
