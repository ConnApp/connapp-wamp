// Packages imports

const mongo = { url: process.env.MONGO_URL || 'mongodb://localhost:27017/enegep' }

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

const isProduction = !isDevelopment
const envName = process.env.NODE_ENV || 'development'

module.exports = {
    mongo,
    envName,
    isProduction,
    isDevelopment,
}
