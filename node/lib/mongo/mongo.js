const _ = require('lodash')
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed
const mongoAddress = 'mongodb://localhost'
mongoose.connect(mongoAddress)


//Models
const models = {


  // #----Example----#
  // User: () => {
  //   //Model info
  //   var collectionName = ''
  //   var modelName = ''
  //   var model = {
  //     email: {
  //       type: String,
  //       required: true
  //     },
  //     name: {
  //       type: String,
  //       required: false,
  //     },
  //     password: {
  //       type: String,
  //       required: true
  //     },
  //     date_registered: {
  //       type: Date,
  //       default: Date.now
  //     }
  //   }
  //
  //   //Define Schema
  //   var dataSchema = mongoose.Schema(model, {collection: collectionName})
  //
  //   //Define hooks
  //   dataSchema.pre('save', function(next){
  //     next()
  //   })
  //
  //   //return Schema and Model Name
  //   return {
  //     schema: dataSchema,
  //     name: modelName
  //   }
  // }
}

module.exports = () => {

  const compiled = _.mapValues(models, (value, key) => {
    const model = value()
    return mongoose.model(model.modelName, model.schema)
  })

  return {
    models: compiled,
    mongoose: mongoose
  }
}
