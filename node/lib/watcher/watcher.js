// Import Modules
const INDEX = require('../../index.js')

// Import Packages
const _ = require('lodash')
const merge = require('merge')

// Define helper variables
const ws = INDEX.connection
const mongo = INDEX.mongo
const dispatcher = INDEX.dispatcher

/**
 * Function to watch for updates on all collections
 */
const watchUpdates = () => {
  Object.keys(mongo.models).forEach(model => {
    const Model = mongo.models[model]
    ws.subscribe(`connapp.server.${model.toLowerCase()}.update`, args => {

      const sentData = (((args.argsDict || {}).data || [])[0] || {})
      const mobileQuery = sentData.argsDict.query
      const mobileSetdata = sentData.argsDict.setData
      const upsert = true

      Model
        .findOneAndUpdate(mobileQuery, mobileSetdata, { upsert, new: true }).exec()
        .then(updatedDoc => {
          dispatcher.updateDocumentToApp(model, updatedDoc._id, updatedDoc)
        })
        .catch(err => console.log(err))
    })
  })
}

/**
 * Function to watch for inserts on all collections
 */
const watchInserts = () => {
  Object.keys(mongo.models).forEach(model => {
    const Model = mongo.models[model]
    ws.subscribe(`connapp.server.${model.toLowerCase()}.insert`, args => {
      console.log(`connapp.server.${model.toLowerCase()}.insert Triggered`)
      const sentData = (((args.argsDict || {}).data || [])[0] || {})
      console.log(sentData)
      const mobileData = sentData.argsDict.data

      let doc = new Model(mobileData)

      // Make sure this is treated as new by the post-save hook
      doc.isNew = true

      doc.save()
        .then(res => {
          dispatcher.insertToApp(model, res)
        })
        .catch(err => console.log(err))
    })
  })
}

/**
 * Function to watch for inserts on all collections
 */
const watchSync = () => {
  Object.keys(mongo.models).forEach(model => {
    const Model = mongo.models[model]
    const uri = `connapp.server.${model.toLowerCase()}.fetch`
    // console.log(uri)
    ws.subscribe(uri, args => {
      // console.log(args)
      const sentData = (((args.argsDict || {}).data || [])[0] || {})
      const ids = sentData.argsList
      const mobileQuery = sentData.argsDict.query
      const mobileSession = sentData.argsDict.session
      const fecthAll = sentData.argsDict.fetchAll === true

      console.log(`${uri} Triggered`)
      // console.log(uri+' was triggered')

      Model
        .find(mobileQuery).exec()
        .then(data => {
          // console.log(data)
          // If nothing is found, does nothing
          if (!data.length) {
            dispatcher.insertToApp(model, {}, 0, mobileSession)
          }

          // console.log(ids)
          // Loops through the found data and dispatch route accordingly

          if (!fecthAll) {
            data.forEach(item => {
              const _id = item._id.toString()
              if ( ids.indexOf(_id) == -1 ) {
                dispatcher.insertToApp(model, item, data.length, mobileSession)
              } else {
                // console.log(item)
                dispatcher.updateDocumentToApp(model, _id, item, mobileSession)
              }
            })
          } else {
            const insertData = data.filter(item => {
              return ids.indexOf(item._id) == -1
            })
            const updateData = data.filter(item => {
              return ids.indexOf(item._id) != -1
            })

            if (insertData.length) {
              _.chunk(insertData, 300).forEach(item => {
                dispatcher.insertToApp(model, item, data.length, mobileSession)
              })
            }

            if (updateData.length) {
              updateData.forEach(item => {
                dispatcher.updateDocumentToApp(model, _id, item, mobileSession)
              })
            }
          }

	      })
        .catch(err => console.log(err))
    })
  })
}

const watchersObj = {
  watchUpdates: watchUpdates,
  watchInserts: watchInserts,
  watchSync: watchSync
}

const runAllWatchers = () => _.mapValues(
  watchersObj,
  watcher => {
    var status = true

    try {
      watcher()
    } catch(e) {
      status = e
    }

    return status
  }
)

// Exports
module.exports = {
  list: watchersObj,
  watchersStatus: runAllWatchers()
}
