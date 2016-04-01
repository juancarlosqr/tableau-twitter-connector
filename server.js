var express = require('express')
  , logger = require('morgan')
  , session = require('express-session')
  , config = require('./config')
  , Grant = require('grant-express')
  , grant = new Grant(require('./grant.json'))

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
  console.log('Twitter credentials', req.query)
  res.end(JSON.stringify(req.query, null, 2))
})

app.get('/', function (req, res) {
  res.redirect('/connect/twitter')
})

app.listen(config.port, function() {
  console.log('Express server listening on port ' + config.port)
})
