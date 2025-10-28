
import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false }
});

export default pool;
