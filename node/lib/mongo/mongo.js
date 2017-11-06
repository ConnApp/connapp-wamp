// Import Modules
const INDEX = require('../../index.js')

// Import Packages
const _ = require('lodash')
const mongoose = require('mongoose')

// Define helper variables
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed = Schema.Types.Mixed
const dispatcher = INDEX.dispatcher
const MONGO = INDEX.CONFIG.MONGO

// Connect to Mongo
mongoose.connect(MONGO.URL)

const dispatchOnSave = (doc, modelName) => {
  const _id = doc._id.toString(),
        data = _.cloneDeep(doc)

  // Dispatches for realtimeUpdate
  if (doc.isNew) {
    dispatcher.insertToApp(modelName, data)
  } else {
    dispatcher.updateDocumentToApp(modelName, _id, data)
  }
}

//Models
const models = {
  events: () => {
    //Model info
    const collectionName = 'events'
    const modelName = 'events'
    const model = {
      /**
      * Nome do evento.
      * @type {String}
      */
      name: {
        type: String,
        required: true
      },
      /**
      * Nome do evento.
      * @type {String}
      */
      description: {
        type: String,
        required: false
      },
      /**
      * Data e hora que o evento irá começar.
      * @type {Date}
      */
      start: {
        type: Date,
        required: true
      },
      /**
      * Data e hora que o evento irá terminar.
      * @type {Date}
      */
      end: {
        type: Date,
        required: true
      },
      /**
      * Quantidade de pessoas que gostaram do evento.
      * @type {Number}
      */
      like: {
        type: Number,
        default: 0
      },
      /**
      * Palestrantes que irão ministrar o evento.
      * @type {Array}
      */
      speakers: [{
        type: ObjectId,
        ref: 'speakers'
      }],
      /**
      * Tipo de evento
      * @type {ObjectId}
      */
      eventType: {
        type: ObjectId,
        ref: 'eventtypes',
        required: true
      },
      /*
      * Ordem de precedência do evento
      * @type {Number}
      */
      order: {
        type: Number,
        default: 0
      },
      /**
      * Local onde o evento será realizado.
      * @type {ObjectId}
      */
      place: {
        type: ObjectId,
        ref: 'places',
        required: true
      },
      /**
      * Define se o evento está ativo.
      * @type {Boolean}
      */
      active: {
        type: Boolean,
        default: true
      },
      /**
      * Data de criação do evento.
      * @type {Date}
      */
      createAt: {
        type: Date,
        default: Date.now
      },
      /**
      * Data da última vez que os dados do evento foi atualizado.
      * @type {String}
      */
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      this.lastUpdated = new Date()
      dispatchOnSave(this, modelName)
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  places: () => {
    //Model info
    const collectionName = 'places'
    const modelName = 'places'
    const model = {
      /**
      * Nome do local.
      * @type {String}
      */
      name: {
        type: String,
        required: true
      },
      /**
      * Imagem com o mapa do local.
      * @type {String}
      */
      mapImage: {
        type: String
      },
      /**
      * Define se o local está ativo.
      * @type {Boolean}
      */
      active: {
        type: Boolean,
        default: true
      },
      /**
      * Data de criação do local.
      * @type {Date}
      */
      createAt: {
        type: Date,
        default: Date.now
      },
      /**
      * Data da última vez que os dados do local foi atualizado.
      * @type {String}
      */
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      this.lastUpdated = new Date()
      dispatchOnSave(this, modelName)
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  eventtypes: () => {
    //Model info
    const collectionName = 'eventtypes'
    const modelName = 'eventtypes'
    const model = {
      /**
      * Nome do eventType.
      * @type {String}
      */
      name: {
        type: String,
        required: true
      },
      /**
      * Define se o eventType está ativo.
      * @type {Boolean}
      */
      active: {
        type: Boolean,
        default: true
      },
      /**
      * Data de criação do eventType.
      * @type {Date}
      */
      createAt: {
        type: Date,
        default: Date.now
      },
      /**
      * Data da última vez que os dados do eventType foi atualizado.
      * @type {String}
      */
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      this.lastUpdated = new Date()
      dispatchOnSave(this, modelName)
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  speakers: () => {
    //Model info
    const collectionName = 'speakers'
    const modelName = 'speakers'
    const model = {
      /**
      * Nome do palestrante.
      * @type {String}
      */
      name: {
        type: String,
        required: true
      },
      /**
      * Fotos do palestrante
      * @type {Object}
      */
      image: {
        perfil: {
          type: String
        },
        cover: {
          type: String
        },
        type: Object
      },
      /**
      * Profissão do palestrante.
      * @type {String}
      */
      profession: {
        type: String
      },
      /**
      * Nome do local onde trabalha
      * @type {String}
      */
      institution: {
        type: String
      },
      /**
      * Descrição sobre o palestrante
      * @type {String}
      */
      about: {
        type: String
      },
      /**
      * Link para meios de comunicação do palestrante
      * @type {String}
      */
      media: {
        type: String
      },
      /**
      * Define se o palestrante está ativo.
      * @type {Boolean}
      */
      active: {
        type: Boolean,
        default: true
      },
      /**
      * Data de criação do palestrante.
      * @type {Date}
      */
      createAt: {
        type: Date,
        default: Date.now
      },
      /**
      * Data da última vez que os dados do palestrante foi atualizado.
      * @type {String}
      */
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      this.lastUpdated = new Date()
      dispatchOnSave(this, modelName)
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  news: () => {
    //Model info
    const collectionName = 'news'
    const modelName = 'news'
    const model = {
      /**
      * Titulo da notícia.
      * @type {String}
      */
      title: {
        type: String,
        required: true
      },
      /**
      * Mensagem da notícia
      * @type {String}
      */
      message: {
        type: String,
        required: true
      },
      /**
      * Capa da notícia.
      * @type {String}
      */
      cover: {
        type: String
      },
      /**
      * Define se o notícia está ativo.
      * @type {Boolean}
      */
      active: {
        type: Boolean,
        default: true
      },
      /**
      * Data de criação do notícia.
      * @type {Date}
      */
      createAt: {
        type: Date,
        default: Date.now
      },
      /**
      * Data da última vez que os dados do notícia foi atualizado.
      * @type {String}
      */
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      this.lastUpdated = new Date()
      dispatchOnSave(this, modelName)
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  },
  info: () => {
    //Model info
    const collectionName = 'info'
    const modelName = 'info'
    const model = {
      /**
      * Titulo da informação.
      * @type {String}
      */
      title: {
        type: String,
        required: true
      },
      /**
      * Mensagem da informação
      * @type {String}
      */
      message: {
        type: String,
        required: true
      },
      /**
      * Define se o informação está ativo.
      * @type {Boolean}
      */
      active: {
        type: Boolean,
        default: true
      },
      /**
      * Data de criação do informação.
      * @type {Date}
      */
      createAt: {
        type: Date,
        default: Date.now
      },
      /**
      * Data da última vez que os dados do informação foi atualizado.
      * @type {String}
      */
      lastUpdate: {
        type: Date,
        default: Date.now
      }
    }

    //Define Schema
    const dataSchema = mongoose.Schema(model, {collection: collectionName})

    //Define hooks
    dataSchema.pre('save', function(next){
      this.lastUpdated = new Date()
      dispatchOnSave(this, modelName)
      next()
    })

    //return Schema and Model Name
    return {
      schema: dataSchema,
      name: modelName
    }
  }
}

// Export functon, to compile all models
module.exports = () => {

  // Map raw schemas to compiled modules
  const compiled = _.mapValues(models, (value, key) => {
    // Get schema object
    const model = value()

    // Returns compiled module
    return mongoose.model(model.name, model.schema)
  })

  // Return Object with compiled odels and mongoose connection object
  return {
    models: compiled,
    mongoose: mongoose
  }
}
