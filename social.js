var Purest = require('purest')
  , config = require('./config')
  , twitter = new Purest({
      provider:'twitter',
      key: config.consumer_key,
      secret: config.consumer_secret
    })

twitter.query()
  .select('followers/list')
  .where({screen_name: config.screen_name})
  .auth(config.access_token, config.access_secret)
  .request(function (err, res, body) {
    // Here body is a parsed JSON object containing things such as
    // id, screen_name and so on
    if (err) console.log(err)
    console.log('BODY', body)
  })
