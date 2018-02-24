const fs = require('fs')
const path = require('path')
const logger = require('loglevel')
const mongoose = require('mongoose')

const requireModels = () => {
    const modelsDirPath = path.join(__dirname, '../../models')

    const models = fs.readdirSync(modelsDirPath)

    for (let model of models) {
        mrequire(model)
    }
}

module.exports = {
    async init(config) {
        const initStatus = {
            status: 'success',
            message: 'Connected to the database successfully',
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

    close: () => {
        mongoose.disconnect()
    },
}
