const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pasteit';


/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile(path.join(
    __dirname, '..', '..', 'client', 'views', 'index.html'));
});

router.get('/views/:name', function (req, res) {
  // res.io.emit("socketToMe", "users");
  var name = req.params.name;
  res.render('views/' + name);
});

// router.get('/:note_title', (req, res, next) => {
//   res.io.emit("socketToMe", "users");
//   res.send();
// });

// CREATE
router.post('/api/v1/paste-it', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {title: req.body.title ,text: req.body.text};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO notes(title,text) values($1 ,$2)',
    [data.title, data.text]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM notes ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


// Read
router.get('/api/v1/paste-it', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM notes ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


// Update
router.put('/api/v1/paste-it/:note_title', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const title = req.params.note_title;
  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Update Data
    client.query('UPDATE notes SET text=($1) WHERE title=($2)',
    [data.text, title]);
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM notes ORDER BY id ASC");

    // res.io.emit(, "users");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});


// Delete
router.delete('/api/v1/paste-it/:note_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.note_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Delete Data
    client.query('DELETE FROM notes WHERE id=($1)', [id]);
    // SQL Query > Select Data
    var query = client.query('SELECT * FROM notes ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      return res.json(results);
    });
  });
});


// Show
router.get('/api/v1/paste-it/:note_title', (req, res, next) => {
  const results = [];
  const title = req.params.note_title;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }

    // SQL Query > Select Data
    client.query('INSERT INTO notes(title) SELECT ($1) WHERE NOT EXISTS (SELECT 1 FROM notes WHERE title=($1))',[title]);
    var query = client.query('SELECT * FROM notes WHERE title = ($1)',[title]);

    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', (result) => {
      done();
      return res.json(results);
    });
  });
});


module.exports = router;
