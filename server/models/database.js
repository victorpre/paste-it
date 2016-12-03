const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/pasteit';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE notes(id SERIAL PRIMARY KEY,title TEXT not null, text TEXT)');
query.on('end', () => { client.end(); });
