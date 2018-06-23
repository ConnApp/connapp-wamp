const test = require('ava')
const path = require('path')

const listFiles = require('./listFiles')

test('should list only files from directory. Excludes index [src directory]', async t => {
    const srcPath = path.resolve(__dirname, '../../')

    const srcFiles = [
        'config',
    ]

    const files = listFiles(srcPath)

    for (let srcFile of srcFiles) {
        t.true(files.includes(srcFile))
    }
})
