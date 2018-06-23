const test = require('ava')
const path = require('path')

const listFolders = require('./listFolders')

test('should list only folders from directory. Excludes files [src directory]', async t => {
    const srcPath = path.resolve(__dirname, '../../')

    const srcFolders = [
        'module',
        'services',
        'utils',
    ]

    const folders = listFolders(srcPath)

    for (let srcFile of srcFolders) {
        t.true(folders.includes(srcFile))
    }
})
