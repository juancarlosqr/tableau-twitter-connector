var express = require('express')
  , logger = require('morgan')
  , session = require('express-session')
  , sessionStore = new session.MemoryStore()
  , config = require('./config')
  , Grant = require('grant-express')
  , grant = new Grant(require('./grant.json'))
  , Purest = require('purest')
  , twitter = new Purest({
      provider:'twitter',
      key: config.consumer_key,
      secret: config.consumer_secret
    });

var app = express();

// views and static setup-up
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
app.use(express.static('public'));

// morgan middleware
app.use(logger(config.logger_env));

// session middleware
app.use(session({
  store: sessionStore,
  saveUninitialized: false,
  secret: config.session_key,
  resave: false
}));

// grant middleware
app.use(grant);

app.get('/handle_twitter_callback', function (req, res) {
  if (req.query.error) {
    // denied access
    res.redirect('/');
  } else {
    var sess = req.session;
    sess.user_id = req.query.raw.user_id;
    sess.access_token = req.query.access_token;
    sess.access_secret = req.query.access_secret;
    res.redirect('/?id=' + encodeURIComponent(sess.id));
  }
});

app.get('/twitter/followers', function (req, res) {
  sessionStore.get(req.query.id, function(err, sess) {
     twitter.query()
      .select('followers/list')
      .where({user_id: sess.user_id, count: 200, cursor: req.query.cursor})
      .auth(sess.access_token, sess.access_secret)
      .request(function (error, response, data) {
        if (error) res.end(JSON.stringify(error, null, 2));
        res.end(JSON.stringify(data, null, 2));
      });
  });
});

app.get('/', function(req, res) {
  res.render('index', {
    title: config.title,
    sessionID: req.query.id || ''
  });
});

app.listen(config.port, config.host, function() {
  console.log('Express server listening on ' + config.host + ':' + config.port);
});
