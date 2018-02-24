const test = require('ava')
const MongodbMemoryServer = require('mongodb-memory-server').MongoMemoryServer
const mongoose = require('mongoose')

const bootstrap = rrequire('utils/bootstrap')

let mongod = new MongodbMemoryServer()
test.before(async () => {
    await bootstrap()

    const uri = await mongod.getConnectionString()
    await mongoose.connect(uri, {
        promiseLibrary: Promise,
        autoReconnect: true,
        reconnectTries: 30,
        reconnectInterval: 1000,
    })
})

test.after.always(async () => {
    mongoose.disconnect()
    mongod.stop()
})
