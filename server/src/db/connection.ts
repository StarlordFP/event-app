// src/db/index.ts
import Knex from 'knex';
import config from '../configs/knexfile.js'; 

const environment = process.env.NODE_ENV || 'development';

const knexConfig = config[environment as keyof typeof config];

if (!knexConfig) {
  throw new Error(
    `No Knex configuration found for environment: "${environment}"`
  );
}

// Create the Knex instance
const db = Knex(knexConfig);

// Optional: very useful for debugging during development
if (process.env.NODE_ENV !== 'production') {
  db.on('query', (query) => {
    console.log('[Knex Query]', query.sql, query.bindings);
  });
}

// Optional: health check on startup (helps catch connection problems early)
db.raw('SELECT 1 + 1 AS result')
  .then(() => {
    console.log('→ Database connection established successfully');
  })
  .catch((err) => {
    console.error('× Failed to connect to database:', err.message);
    process.exit(1); // optional: crash early in development
  });

// Export the instance so other files can import it
export default db;