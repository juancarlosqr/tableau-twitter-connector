var express = require('express')
  , logger = require('morgan')
  , session = require('express-session')
  , config = require('./config')
  , Grant = require('grant-express')
  , grant = new Grant(require('./grant.json'))
  , Purest = require('purest')
  , twitter = new Purest({
      provider:'twitter',
      key: config.consumer_key,
      secret: config.consumer_secret
    })

var app = express()

// morgan middleware
app.use(logger(config.logger_env))

// session middleware
app.use(session({
  saveUninitialized: false,
  secret: config.session_key,
  resave: false
}))

// grant middleware
app.use(grant)

app.get('/handle_twitter_callback', function (req, res) {
  twitter.query()
    .select('followers/list')
    .where({user_id: req.query.raw.user_id, count: 200})
    .auth(req.query.access_token, req.query.access_secret)
    .request(function (error, response, data) {
      if (error) res.end(JSON.stringify(error, null, 2))
      console.log('Followers count:', data.users.length)
      res.end(JSON.stringify(data, null, 2))
    })
})

app.get('/', function (req, res) {
  res.redirect('/connect/twitter')
})

app.listen(config.port, function() {
  console.log('Express server listening on port ' + config.port)
})
