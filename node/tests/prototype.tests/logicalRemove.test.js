var
  INDEX = require('../index.js'),
  mongo = INDEX.mongo,
  date = new Date(),
  day = date.getDate(),
  month = date.getMonth() + 1,
  year = date.getFullYear(),
  dateString = [day, month, year].join('/'),
  hour = date.getHours().toString(),
  minute = date.getMinutes().toString(),
  seconds = date.getSeconds().toString()

if (hour < 10) hour = '0' + hour
if (minute < 10) minute = '0' + minute
if (seconds < 10) seconds = '0' + seconds

const hours = [hour, minute, seconds].join(':')
const timestamp = dateString + ' ' + hours

const query = {
  _id: '59a30ef6bd23ca13fa233427'
}

mongo.models.fakenews.findOne(query)
  .then(res => {
    console.log(res)
    res.active = false
    return res.save()
  })
  .then(res => console.log('Notícia foi removida com sucesso'))
  .catch(e => console.log(e))
