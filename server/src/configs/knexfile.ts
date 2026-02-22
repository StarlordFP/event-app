import type { Knex } from 'knex';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Fix for dotenv path since working directory changes
dotenv.config({ path: join(__dirname, '../../.env') });

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'event_user',
      password: process.env.DB_PASSWORD || 'event_password',
      database: process.env.DB_NAME || 'event_db',
    },
    migrations: {
      directory: join(__dirname, '../db/migrations'),
      extension: 'ts',
    },
    seeds: {
      directory: join(__dirname, '../db/seeds'),
      extension: 'ts',
    },
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    },
    migrations: {
      directory: join(__dirname, '../db/migrations'),
    },
    pool: { min: 2, max: 10 },
  },
};

export default config;