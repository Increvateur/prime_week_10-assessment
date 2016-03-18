var express = require("express");
var router = express.Router();
var path = require("path");
var pg = require("pg");
var random = require("../routes/random.js")

var connectionString = '';

if (process.env.DATABASE_URL != undefined) {
    connectionString = process.env.DATABASE_URL + 'ssl';
} else {
    connectionString = 'postgres://localhost:5432/assessment_test';
}

router.get("/random", function(req, res){
  res.send(random);
});

router.post('/animals', function(req, res) {
  console.log('Received req body:', req.body)
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var start = client.query('CREATE TABLE IF NOT EXISTS animals' +
                             '(id SERIAL NOT NULL, animal varchar(255) NOT NULL,' +
                             'amount varchar(255) NOT NULL, CONSTRAINT employees_pkey PRIMARY KEY (id))');

    var query = client.query('INSERT INTO animals (animal, amount) VALUES ($1, $2)' +
                             'RETURNING id, animal, amount',
                             [req.body.animal, req.body.amount]);

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.get('/animals', function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.log('Error connecting to the database:', err);
      res.status(500).send(err);
      done();
      return;
    }

    var query = client.query('SELECT * FROM animals');

    var result = [];

    query.on('row', function(row) {
      result.push(row);
    });

    query.on('end', function() {
      res.send(result);
      done();
    });

    query.on('error', function(error) {
      console.log('Error querying the database:', error);
      res.status(500).send(error);
      done();
    });
  });
});

router.get("/*", function(req,res){
  var file = req.params[0] || "/views/index.html";
  res.sendFile(path.join(__dirname, "../public/", file));
});

module.exports = router;
