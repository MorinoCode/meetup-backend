
import pool from "../db/pool.mjs";

export async function getUserProfile(userId) {
  const userQ = `SELECT id, username, email, created_at FROM users WHERE id=$1`;
  const userR = await pool.query(userQ, [userId]);
  if (!userR.rows.length) return null;
  const user = userR.rows[0];

  const historyQ = `
    SELECT m.id AS meetup_id, m.title, m.date, r.rating, r.comment
    FROM attendees a
    JOIN meetups m ON a.meetup_id = m.id
    LEFT JOIN reviews r ON a.meetup_id = r.meetup_id AND a.user_id = r.user_id
    WHERE a.user_id = $1
    ORDER BY m.date DESC;
  `;
  const histR = await pool.query(historyQ, [userId]);

  return { id: user.id, username: user.username, email: user.email, created_at: user.created_at, history: histR.rows };
}
