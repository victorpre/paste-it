const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pasteit';

const client = new pg.Client(connectionString);
client.connect();
var query = client.query(
  'CREATE TABLE notes(id SERIAL PRIMARY KEY,title TEXT not null, text TEXT)');
query = client.query('CREATE TABLE users(id SERIAL PRIMARY KEY,name VARCHAR(45) not null, email VARCHAR(255) not null, password VARCHAR(255) not null)');
query.on('end', () => { client.end(); });
