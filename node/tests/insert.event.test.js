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

const event = {
  name: 'test event inserted',
  eventtype: '59bc2fcd3d63679b77fe6cc7',
  local: '59bc2fcd3d63679b77fe6caf',
  speakers: [],
  start: new Date(2017, 8, 10, 12, 30, 0),
  end: new Date(2017, 8, 10, 14, 30, 0)
}

const eventModel = new mongo.models.events(event)
eventModel.isNew = true

eventModel.save()
  .then(res => {
    console.log('Evento nova adicionada com sucesso')
  })
  .catch(e => console.log(e))
