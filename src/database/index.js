const fs = require('fs')
const path = require('path')
const logger = require('loglevel')
const mongoose = require('mongoose')

const config = rrequire('config')

const requireModels = () => {
    const modelsDirPath = path.join(__dirname, 'models')

    const models = fs.readdirSync(modelsDirPath)

    for (let model of models) {
        rrequire(`database/models/${model}`)
    }
}

module.exports = {
    name: 'database',
    async init() {
        const initStatus = {
            status: 'success',
            message: 'Connected to the DATABASE successfully',
        }

        try {
            await mongoose.connect(config.mongo.url, { promiseLibrary: Promise })

            requireModels()
        } catch (err) {
            initStatus.status = 'error'
            initStatus.message = err.message

            logger.error(err)
        }

        return initStatus
    },

    close() {
        return mongoose.disconnect()
    },
}
