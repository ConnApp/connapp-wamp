var
  INDEX = require('../index.js'),
  mongo = INDEX.mongo,
  date = new Date(),
  day = date.getDate(),
  month = date.getMonth() + 1,
  year = date.getFullYear(),
  dateString = [day, month, year].join('/'),
  hour = date.getHours().toString(),
  minute = date.getMinutes().toString()

if (hour < 10) hour = '0' + hour
if (minute < 10) minute = '0' + minute

const hours = [hour, minute].join(':')
const timestamp = dateString + ' ' + hours

const fakenews = {
  title: 'Título de uma nova notícia',
  body: `Essa notícia foi adicionada em ${timestamp}`
}

const CNN = new mongo.models.fakenews(fakenews)
CNN.isNew = true

CNN.save()
  .then(res => {
    console.log('Notícia nova adicionada com sucesso')
  })
  .catch(e => console.log(e))
