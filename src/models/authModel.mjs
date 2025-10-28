
import pool from "../db/pool.mjs";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function registerUser(username, email, password) {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const q = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    ON CONFLICT (email) DO NOTHING
    RETURNING id, username, email;
  `;
  const { rows } = await pool.query(q, [username, email, hashedPassword]);
  return rows[0] || null;
}

export async function getUserByEmail(email) {
  const q = `SELECT id, username, email, password_hash FROM users WHERE email=$1`;
  const { rows } = await pool.query(q, [email]);
  return rows[0] || null;
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
