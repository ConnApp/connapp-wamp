var INDEX = require('../index.js')

const fakenews = {
  title: 'is fake',
  body: 'is also fake'
}

var mongo = INDEX.mongo

const CNN = new mongo.models.FakeNews(fakenews)

CNN.save()
  .then(res => {
    console.log(res)
  })
  .catch(e => console.log(e))
