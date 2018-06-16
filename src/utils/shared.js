const fs = require('fs')
const path = require('path')

function buildRoute() {
    return [
        ...arguments,
    ].join('.')
}

// TODO test
const readFileInDir = dirPath => {
    const files = fs
        .readdirSync(dirPath)
        .filter(file => {
            const isIndex = file.includes('index')
            const isTest = file.includes('.test.js')
            const isDirectory = fs.lstatSync(path.resolve(dirPath, file)).isDirectory()

            return !isIndex && !isDirectory && !isTest
        })
        .map(file => file.replace('.js', ''))

    return files
}

// TODO test
const isFunction = element => typeof element === 'function'

const getObjectType = fn => {
    const fnString = Object.prototype.toString.call(fn)

    const rawType = fnString.replace(/(\[|\])/g, '')

    return rawType.split(' ').pop()
}

const listFoldersInDirectory = (directory, excludeList = []) => {
    return fs.readdirSync(directory).filter(folder => {
        const folderPath = path.join(directory, folder)

        const isFolderAndExists = fs.existsSync(folderPath) && fs.lstatSync(folderPath).isDirectory()

        return isFolderAndExists && !excludeList.includes(folder)
    })
}

const getMethodsByOperations = (directory, operation, excludeList = []) => {
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

module.exports = {
    isFunction,
    buildRoute,
    readFileInDir,
    getObjectType,
    getMethodsByOperations,
    listFoldersInDirectory,
}
