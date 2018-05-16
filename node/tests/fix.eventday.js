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

const query = {}

const eventModel = mongo.models.events

const getDate = (date) => {
  let day = date.getDate()
  let month = date.getMonth()
  let year = date.getFullYear()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()

  // Current day object with all needed info
  return {
    date: date,
    day: day,
    month: month + 1,
    year: year,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    fullDate: [
      day < 10? '0' + day.toString() : day,
      month < 10? '0' + (month + 1).toString() : (month + 1),
      year
    ].join('/'),
    fullTime: [
      hours < 10? '0' + hours.toString() : hours,
      minutes < 10? '0' + minutes.toString() : minutes,
      seconds < 10? '0' + seconds.toString() : seconds
    ].join(':')
  }
}

const fixWrongDate = (dateInfo) => {
  let dateObject = {...dateInfo}
  let swap = dateObject.month
  dateObject.month = dateObject.day
  dateObject.day = swap
  return dateObject
}

const swapDayAndMonth = (event) => {
  let startDate = getDate(event.start)
  let endDate = getDate(event.end)

  if (startDate.month > 10) {
    startDate = fixWrongDate(startDate)
  }

  if (endDate.month > 10) {
    endDate = fixWrongDate(endDate)
  }

  event.start = new Date (startDate.year, startDate.month - 1, startDate.day, startDate.hours, startDate.minutes, startDate.seconds, )
  event.end = new Date (endDate.year, endDate.month - 1, endDate.day, endDate.hours, endDate.minutes, endDate.seconds, )
  return event.save()
}

eventModel.find({})
  .then(res => {
    if (res.length) {
      return Promise.all(res.map(swapDayAndMonth))
    }
  })
  .then(res => {
    console.log(res)
  })
  .catch(e => console.log(e))
