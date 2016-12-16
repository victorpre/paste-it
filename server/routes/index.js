const express = require('express');
const router = express.Router();
const pg = require('pg');
const path = require('path');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pasteit';

// Auth
const bodyParser = require('body-parser');
const argon2i = require('argon2-ffi').argon2i;
const crypto = require('crypto');
const Promise = require('bluebird');
const randomBytes = Promise.promisify(crypto.randomBytes);
const salt = new Buffer('sambinha');
var jsonParser = bodyParser.json();

var MIN_PASSWORD_LENGTH = 8;
var MAX_PASSWORD_LENGTH = 160;


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

// Create user
router.post('/user/register',jsonParser, function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  var user = {};
  var hashPassword = {};
  if (!req.body) { return res.sendStatus(400); }
  if (!email || !password) {
    return res.status(400).send('Missing email or password');
  }
  // Check for user already created
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    const query = client.query('SELECT * FROM users where email=($1)',[email]);

    query.on('row', (row) => {
      user=row;
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      done();
      if(Object.keys(user).length>0){
        console.log(user);
        return res.status(409).send('A user with the specified email already exists');
      }
      else{
        randomBytes(32).then(salt => argon2i.hash(password, salt)).then(function(pass){
          hashPassword = pass;
        }).then(function(){
          pg.connect(connectionString, (err, client, done) => {
            // Handle connection errors
            if(err) {
              done();
              console.log(err);
              return res.status(500).json({success: false, data: err});
            }
            // SQL Query > Insert Data
            const query = client.query('INSERT INTO users(name,email,password) values($1 ,$2,$3)',
            [name, email,hashPassword]);

            // After all data is returned, close connection and return results
            query.on('end', () => {
              done();
              return res.status(200).send("User created successfully.");
            });
          });
        });
      }
    });
  });
});

  router.post('/user/login', jsonParser, function (req, res,next) {
    var encodedHash = "";
    var user = {};
    const email = req.body.email;
    const password = req.body.password;

    if (!req.body) { return res.sendStatus(400); }

    if (!email || !req.body.password) {
      return res.status(400).send('Missing email or password');
    }

    pg.connect(connectionString, (err, client, done) => {
      // Handle connection errors
      if(err) {
        done();
        console.log(err);
        return res.status(500).json({success: false, data: err});
      }
      // SQL Query > Insert Data
      const query = client.query('SELECT * FROM users WHERE email=($1)',
      [email]);

      query.on('row', (row) => {
        user = row;
        encodedHash = user.password;
      });
      query.on('end', () => {
        done();
        if (!encodedHash) { return res.status(401).send('Email not registered.'); }
        argon2i.verify(encodedHash, password).then(function(correct){
          if(correct){
            return res.status(200).send(user);
          }
          else{
            return res.sendStatus(401);
          }
        });
      });
    });

  });


module.exports = router;
