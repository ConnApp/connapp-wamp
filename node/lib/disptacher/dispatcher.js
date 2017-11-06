// Import Modules
const INDEX = require('../../index.js')

// Import Packages
const _ = require('lodash')

// Define helper variables
const ws = INDEX.connection

/**
 * Function to dispatch event whenever a document is updated on MongoDB.
 * @param  {String} type      Type of action. e.g. Update, New, Delete, Fetch
 * @param  {String} model     Mongoose model the function was dispatched from
 * @param  {String} _id       ID of the documento to perform publish
 * @param  {Object} [data={}] Updated data to send
 */
const insertToApp = (model, data = {}, length = undefined, session = undefined) => {
  // Builds event string
  console.log('Starting insert dispatch')
  const event = session?
    `connapp.app.${session}.${model.toLowerCase()}.insert` :
    `connapp.app.${model.toLowerCase()}.insert`

  const isLengthValid = typeof length !== 'undefined'

  const publishArray = isLengthValid? [data, length] : [data]

  // Publish the event
  ws.publish(
    event,
    publishArray
  )

  console.log(event + ' was published. Total of: ' + length)
}

// FUnction to tell the App to update local documento o model
const updateDocumentToApp = (model, _id, data = {}, session = undefined) => {
  // Builds event string

  console.log('Starting update dispatch')
  const event = session?
    `connapp.app.${session}.${model.toLowerCase()}.update.${_id}` :
    `connapp.app.${model.toLowerCase()}.update.${_id}`

  // console.log(event, data)
  // Publish the event
  ws.publish(
    event,
    [data]
  )

  console.log(event + ' was published')

}

// Exports
module.exports = {
  insertToApp: insertToApp,
  updateDocumentToApp: updateDocumentToApp
}
