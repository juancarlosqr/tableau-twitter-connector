var express = require('express')
  , router = express.Router()
  , fs = require('fs')
  , path = require('path')
  , pg = require('pg')
  , Batch = require('batch')
  , batch = new Batch;

router.get('/schema', function (req, res, next) {
  pg.connect(process.env.DATABASE_URL, function (err, client) {
    if (err) {
      res.send({type: 'connect', message: 'error', error: err});
      process.exit(1);
    }
    processSQLFile(path.resolve(__dirname, 'session.sql'), client, res);
  });
});

function processSQLFile (fileName, client, res) {
  // Extract SQL queries from files. Assumes no ';' in the fileNames
  var queries = fs.readFileSync(fileName).toString()
    .replace(/(\r\n|\n|\r)/gm," ") // remove newlines
    .replace(/\s+/g, ' ') // excess white space
    .split(";") // split into all statements
    .map(Function.prototype.call, String.prototype.trim)
    .filter(function (el) { return el.length != 0 }); // remove any empty ones

  // Execute each SQL query sequentially
  queries.forEach(function (query) {
    batch.push(function (done) {
      client.query(query, function (err, result) {
        done();
        if (err) {
          res.send({type: 'query', message: 'error', result: error});
          process.exit(1);
        }
        res.send({message: 'success', result: result});
        process.exit(0);
      });
    });
  });
}

module.exports = router;
