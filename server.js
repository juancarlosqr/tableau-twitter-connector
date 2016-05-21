var express = require('express')
  , logger = require('morgan')
  , session = require('express-session')
  , auth = require('http-auth')
  , sysInfo = require('./utils/sys-info')
  , Grant = require('grant-express')
  , grant = null
  , Purest = require('purest')
  , twitter = null
  , env = process.env
  , app = express()
  , title = 'Tableau Twitter Connector'
  , sessionStore = null
  , httpAuth = null
  , config = null
  , configHost = null
  , schema = require('./routes/schema');

// config variables
if (env.NODE_ENV === 'production') {
  config = {
    protocol: env.APP_PROTOCOL,
    host: env.APP_HOST,
    port: env.PORT,
    logger_env: env.NODE_ENV,
    session_key: env.APP_SESSION_KEY,
    consumer_key: env.APP_TW_KEY,
    consumer_secret: env.APP_TW_SECRET,
    user: env.APP_USER,
    auth: env.APP_AUTH
  };
  configHost = env.APP_HOST;
  sessionStore = new (require('connect-pg-simple')(session))();
} else {
  config = require('./config');
  configHost = config.host + ':' + config.port;
  sessionStore = new session.MemoryStore();
}

// session middleware
app.use(session({
  store: sessionStore,
  saveUninitialized: false,
  secret: config.session_key,
  resave: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
}));

// grant middleware
grant = new Grant({
  'server': {
    'protocol': config.protocol,
    'host': configHost
  },
  'twitter': {
    'key': config.consumer_key,
    'secret': config.consumer_secret,
    'callback': '/handle_twitter_callback'
  }
});

app.use(grant);

twitter = new Purest({
  provider: 'twitter',
  key: config.consumer_key,
  secret: config.consumer_secret
});

// http-auth middleware
httpAuth = auth.basic({
  realm: title
}, function (username, password, callback) {
  callback(username === config.user && password === config.auth);
});

// morgan middleware
app.use(logger(config.logger_env));

// views and static setup-up
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

/*
 * ROUTES
 */

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
      .where({
        user_id: sess.user_id,
        cursor: req.query.cursor,
        count: 200,
        skip_status: true,
        include_user_entities: false
      })
      .auth(sess.access_token, sess.access_secret)
      .request(function (error, response, data) {
        if (error) {
          res.end(JSON.stringify(error, null, 2));
        } else {
          res.set('Content-Type', 'application/json');
          res.set('Cache-Control', 'no-cache, no-store');
          res.end(JSON.stringify(data, null, 2));
        }
      });
  });
});

app.use('/schema', auth.connect(httpAuth), schema);

app.get('/info/:func', auth.connect(httpAuth), function(req, res) {
  var func = req.params.func;
  if (func !== 'gen' && func !== 'poll') {
    res.end();
  } else {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[func](), null, 2));
  }
});

app.get('/monitor', auth.connect(httpAuth), function(req, res) {
  res.render('monitor');
});

app.get('/health', function(req, res) {
  res.end();
});

app.get('/heroku', function(req, res) {
  res.render('pages/index');
});

app.get('/', function(req, res) {
  res.set('Cache-Control', 'no-cache, no-store');
  res.render('index', {
    title: title,
    sessionID: req.query.id || ''
  });
});

app.listen(config.port, function() {
  console.log(`Express server listening on port ${ config.port }`);
  console.log(`Application worker ${ process.pid } started...`);
});
