import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_PORT_TEST,
  POSTGRES_DB,
  POSTGRES_DB_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD
} = process.env;

console.log('NODE_ENV', NODE_ENV);

const database = NODE_ENV === 'development' ? POSTGRES_DB : POSTGRES_DB_TEST;
const port = NODE_ENV === 'development' ? POSTGRES_PORT : POSTGRES_PORT_TEST;

const client = new Pool({
  host: POSTGRES_HOST,
  port: Number(port),
  database: database,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
});

export default client;
