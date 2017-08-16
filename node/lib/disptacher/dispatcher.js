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
const dispatchFetch = (model, _id, data = {}) => {
  // Builds event string
  const event = `conapp.${model}.fetch.${data._id.toString()}`

  // Publish the event
  ws.publish(
    event,
    [{ model }],
    data
  )
}

// Exports
module.exports = {
  dispatchFetch: dispatchFetch
}
