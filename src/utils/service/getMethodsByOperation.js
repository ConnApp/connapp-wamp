const fs = require('fs')
const path = require('path')

module.exports = function utils_service_getMethodsByOperation(directory, operation, excludeList = []) {
    if (!directory || !operation) throw new Error('Missing directory or operation')

    return fs.readdirSync(directory).filter(file => {
        const filePath = path.join(directory, file)

        const exists = fs.existsSync(filePath)
        const isNotIndex = file !== 'index.js'
        const isNotTest = !file.includes('.test.js')
        const isOfOperation = file.includes(`${operation}.`)

        const isNotExcluded = excludeList.length
            ? excludeList.every(excludeElement => !file.includes(excludeElement))
            : true

        return exists && isNotIndex && isNotTest && isOfOperation && isNotExcluded
    })
}
