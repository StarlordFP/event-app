import knex, { Knex } from 'knex';
import { config } from './index';

const baseConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: config.DB_HOST,
    port: config.DB_PORT,
    user: config.DB_USER,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
  },
  pool: { min: 2, max: 10 },
};

export const db = knex(baseConfig);
