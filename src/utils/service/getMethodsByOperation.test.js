const test = require('ava')

const path = require('path')

const proxyquire = require('proxyquire')
const getMethodsByOperation = require('./getMethodsByOperation')

test('should throw error [missing directory]', async t => {
    const error = await t.throws(() => getMethodsByOperation())

    t.is(error.message, 'Missing directory or operation')
})

test('should throw error [missing operation]', async t => {
    const error = await t.throws(() => getMethodsByOperation(__dirname))

    t.is(error.message, 'Missing directory or operation')
})

test('should return correct files. Excludes test [post.save middlewares]', async t => {
    const operation = 'save'

    const middlewareDirectory = path.resolve(__dirname, '../../module/middlewares/pre')

    const getMethodsByOperation = proxyquire('./getMethodsByOperation', {
        fs: {
            readdirSync() {
                return [
                    'save.operation1.js',
                    'update.operation1.js',
                    'update.operation1.teste.js',
                    'index.js',
                ]
            },
        },
    })

    const result = getMethodsByOperation(middlewareDirectory, operation)

    for (let file of result) {
        const fileDefinitions = file.split('.')

        t.is(fileDefinitions[0], operation) // save. FILE_NAME
        t.false(fileDefinitions.includes('test'))
    }

    t.pass()
})
