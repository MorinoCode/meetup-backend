
import pool from "../db/pool.mjs";

export async function attendMeetupQuery(userId, meetupId) {
  const cap = await pool.query(
    `SELECT m.capacity, COALESCE(COUNT(a.user_id),0) AS count
     FROM meetups m
     LEFT JOIN attendees a ON m.id=a.meetup_id
     WHERE m.id=$1
     GROUP BY m.id`,
    [meetupId]
  );
  if (!cap.rows.length) throw new Error("Meetup not found");
  const { capacity, count } = cap.rows[0];
  if (Number(count) >= Number(capacity)) {
    const e = new Error("This meetup is full.");
    e.code = "MEETUP_FULL";
    throw e;
  }

  const query = `
    INSERT INTO attendees (user_id, meetup_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, meetup_id) DO NOTHING;
  `;
  await pool.query(query, [userId, meetupId]);
}

export async function leaveMeetupQuery(userId, meetupId) {
  const q = `DELETE FROM attendees WHERE user_id=$1 AND meetup_id=$2 RETURNING *;`;
  const result = await pool.query(q, [userId, meetupId]);
  return result.rowCount > 0;
}
