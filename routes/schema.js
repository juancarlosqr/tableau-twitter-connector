var express = require('express')
  , router = express.Router()
  , pg = require('pg')
  , queries = {
    drop: 'DROP TABLE IF EXISTS "session";',
    create: 'CREATE TABLE "session" ("sid" varchar NOT NULL COLLATE "default", "sess" json NOT NULL, "expire" timestamp(6) NOT NULL ) WITH (OIDS=FALSE);',
    alter: 'ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;'
  };

router.get('/:action', function (req, res, next) {
  pg.defaults.ssl = true;
  var query = null
    , action = req.params.action
    , client = new pg.Client(process.env.DATABASE_URL);
  client.connect();
  query = client.query(queries[action]);
  query.on('end', function (result) {
    client.end();
    res.write('Action ' + action + ' executed successfully!');
    res.end();
  });
});

module.exports = router;
