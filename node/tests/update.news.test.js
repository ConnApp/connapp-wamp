let
  INDEX = require('../index.js'),
  mongo = INDEX.mongo,
  date = new Date(),
  day = date.getDate(),
  month = date.getMonth() + 1,
  year = date.getFullYear(),
  hour = date.getHours().toString(),
  minute = date.getMinutes().toString(),
  seconds = date.getSeconds().toString()

if (month < 10) month = '0' + month
if (day < 10) day = '0' + day
if (hour < 10) hour = '0' + hour
if (minute < 10) minute = '0' + minute
if (seconds < 10) seconds = '0' + seconds

let dateString = [day, month, year].join('/')

const hours = [hour, minute, seconds].join(':')
const timestamp = dateString + ' ' + hours
const newsModel = mongo.models.news

newsModel.findOne({active: true})
  .then(res => {
    res.title = timestamp + ' - Modificou!'
    res.isNew = false
    return res.save()
  })
  .then(res => {
    console.log('Logical Remove com sucesso')
  })
  .catch(e => console.log(e))
