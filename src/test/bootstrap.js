const test = require('ava')
const mongoose = require('mongoose')
const MongodbMemoryServer = require('mongodb-memory-server').MongoMemoryServer

const mongod = new MongodbMemoryServer()

test.before(async () => {
    const uri = await mongod.getConnectionString()

    await mongoose.connect(uri, {
        reconnectTries: 30,
        autoReconnect: true,
        promiseLibrary: Promise,
        reconnectInterval: 1000,
    })
})

test.after.always(async () => {
    mongoose.disconnect()

    mongod.stop()
})
