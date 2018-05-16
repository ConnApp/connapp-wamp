let
  INDEX = require('../index.js'),
  mongo = INDEX.mongo,
  ws = INDEX.connection
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

const news = {
   title: 'Notícia nova! - Teste',
   message: 'Notícia publicada em ' + timestamp,
}

ws.publish(
  `connapp.app.notification.test`,
  [{
     title: 'Notícia nova! - Teste',
     message: 'Notícia publicada em ' + timestamp,
  }]
)
