const fs = require('fs')
const path = require('path')
const { getMethodsByOperations } = rrequire('utils/shared')

module.exports = async function getServiceMiddlewares(serviceName, payload, procedure) {
    const errors = []

    const validatorsPath = path.resolve(__dirname, '../../module/validators')

    const isFolderAndExists = fs.existsSync(validatorsPath) && fs.lstatSync(validatorsPath).isDirectory()

    if (!isFolderAndExists) return errors

    const validatorFiles = getMethodsByOperations(serviceName, validatorsPath)

    if (!validatorFiles.length) return errors

    for (let validator of validatorFiles) {
        try {
            await require(`${validatorsPath}/${validator}`)({ ...payload })
        } catch (error) {
            errors.push({
                procedure,
                reason: error.message,
                validator: validator.name,
            })
        }
    }

    return errors
}
