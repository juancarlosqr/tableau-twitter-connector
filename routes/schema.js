var express = require('express')
  , router = express.Router()
  , fs = require('fs')
  , path = require('path')
  , pg = require('pg')
  , Batch = require('batch')
  , batch = new Batch;

router.get('/schema', function (req, res, next) {
  pg.defaults.ssl = true;
  pg.connect(process.env.DATABASE_URL, function (err, client) {
    if (err) {
      res.send({type: 'connect', message: 'error', error: err});
      process.exit(1);
    }
    console.log('Connected to postgres! Running schemas...');
    processSQLFile(path.resolve(__dirname, 'session.sql'), client);
    res.send({message: 'queries sended to run'});
  });
});

function processSQLFile (fileName, client) {
  console.log('fileName', fileName);
  // Extract SQL queries from files. Assumes no ';' in the fileNames
  var queries = fs.readFileSync(fileName).toString()
    .replace(/(\r\n|\n|\r)/gm," ") // remove newlines
    .replace(/\s+/g, ' ') // excess white space
    .split(";") // split into all statements
    .map(Function.prototype.call, String.prototype.trim)
    .filter(function (el) { return el.length != 0 }); // remove any empty ones

  console.log('Starting executing querys');
  // Execute each SQL query sequentially
  queries.forEach(function (query) {
    console.log('Executing query = ', query);
    // batch.push(function (done) {
      client.query(query, function (err, result) {
        if (err) {
          console.log(JSON.stringify({type: 'query', message: 'error', result: error}));
          process.exit(1);
        }
        // done();
        console.log(JSON.stringify({message: 'success', result: result}));
        process.exit(0);
      });
    // });
  });
  done();
}

module.exports = router;
