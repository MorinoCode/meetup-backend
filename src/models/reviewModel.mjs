
import pool from "../db/pool.mjs";

export async function addOrUpdateReview(userId, meetupId, rating, comment) {
  const { rows: dateRows } = await pool.query(`SELECT date FROM meetups WHERE id=$1`, [meetupId]);
  if (!dateRows.length) throw new Error("Meetup not found");
  const meetupDate = new Date(dateRows[0].date);
  const today = new Date();
  if (meetupDate >= new Date(today.toDateString())) {
    throw new Error("You can only review after the meetup date.");
  }

  const q = `
    INSERT INTO reviews (user_id, meetup_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (user_id, meetup_id) DO UPDATE SET
      rating = EXCLUDED.rating,
      comment = EXCLUDED.comment,
      updated_at = NOW()
    RETURNING *;
  `;
  const { rows } = await pool.query(q, [userId, meetupId, rating, comment]);
  return rows[0];
}

export async function getMeetupReviews(meetupId) {
  const q = `
    SELECT r.id, r.rating, r.comment, r.created_at, u.username AS reviewer_username
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.meetup_id = $1
    ORDER BY r.created_at DESC;
  `;
  const { rows } = await pool.query(q, [meetupId]);
  return rows;
}
