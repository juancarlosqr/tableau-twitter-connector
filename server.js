var express = require('express')
  , logger = require('morgan')
  , session = require('express-session')
  , config = require('./config')
  , sysInfo = require('./utils/sys-info')
  , Grant = require('grant-express')
  , grant = new Grant(require('./grant.json'))
  , Purest = require('purest')
  , twitter = new Purest({
      provider:'twitter',
      key: config.consumer_key,
      secret: config.consumer_secret
    })
  , env = process.env
  , sessionStore = null;


var app = express();
var port = env.NODE_PORT || config.port;
var host = env.NODE_IP || config.host;

// session middleware config
if (env.NODE_ENV === 'production') {
  var MongoDBStore = require('connect-mongodb-session')(session);
  sessionStore = new MongoDBStore({
    uri: env.OPENSHIFT_MONGODB_DB_URL,
    collection: config.session_collection
  });
} else {
  sessionStore = new session.MemoryStore()
}

app.use(session({
  store: sessionStore,
  saveUninitialized: false,
  secret: config.session_key,
  resave: false
}));

// views and static setup-up
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
app.use(express.static('public'));

// morgan middleware
app.use(logger(env.NODE_ENV || config.logger_env));

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

app.get('/info/:func', function(req, res) {
  var func = req.params.func;
  if (func !== 'gen' && func !== 'poll') {
    res.end();
  } else {
    res.set('Content-Type', 'application/json');
    res.set('Cache-Control', 'no-cache, no-store');
    res.end(JSON.stringify(sysInfo[func](), null, 2));
  }
});

app.get('/health', function(req, res) {
  res.end();
});

app.get('/monitor', function(req, res) {
  res.render('monitor');
});

app.get('/', function(req, res) {
  res.set('Cache-Control', 'no-cache, no-store');
  res.render('index', {
    title: config.title,
    sessionID: req.query.id || ''
  });
});

app.listen(port, host, function() {
  console.log(`Express server listening on ${ host }:${ port }`);
  console.log(`Application worker ${ process.pid } started...`);
});
