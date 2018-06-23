const fs = require('fs')
const path = require('path')

module.exports = function utils_files_listFiles(directory) {
    const files = fs
        .readdirSync(directory)
        .filter(file => {
            const isIndex = file.includes('index')
            const isTest = file.includes('.test.js')
            const isDirectory = fs.lstatSync(path.resolve(directory, file)).isDirectory()

            return !isIndex && !isDirectory && !isTest
        })
        .map(file => file.replace('.js', ''))

    return files
}
