
import pool from "../db/pool.mjs";

export async function createMeetup({ title, description, location, date, time, host_id, capacity }) {
  const q = `
    INSERT INTO public.meetups (title, description, location, date, time, host_id, capacity)
    VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, 50))
    RETURNING id, title, description, location, date, time, host_id, capacity;
  `;
  const { rows } = await pool.query(q, [title, description ?? null, location, date, time, host_id, capacity]);
  return rows[0];
}

export async function getAllMeetups({ search = '', dateFilter = '', dateFrom = '', dateTo = '' } = {}) {
  let query = `
    SELECT m.id, m.title, m.description, m.location, m.date, m.time, m.capacity, u.username AS host_name
    FROM public.meetups m
    LEFT JOIN users u ON m.host_id = u.id
  `;
  const params = [];
  const where = [];

  const term = String(search).trim();
  if (term) {
    params.push(term);
    const idx = params.length;
    where.push(`(m.title ILIKE '%' || $${idx} || '%' OR m.description ILIKE '%' || $${idx} || '%' OR m.location ILIKE '%' || $${idx} || '%')`);
  }
  if (dateFilter === 'upcoming') where.push('m.date >= CURRENT_DATE');
  if (dateFilter === 'past')     where.push('m.date <  CURRENT_DATE');
  if (dateFrom) { params.push(dateFrom); where.push(`m.date >= $${params.length}`); }
  if (dateTo)   { params.push(dateTo);   where.push(`m.date <= $${params.length}`); }

  if (where.length) query += ' WHERE ' + where.join(' AND ');
  query += ' ORDER BY m.date ASC, m.time ASC';

  const { rows } = await pool.query(query, params);
  return rows;
}

export async function getMeetupDetails(meetupId) {
  const q = `
    SELECT 
      m.id, m.title, m.description, m.location, m.date, m.time, m.capacity, u.username AS host_name,
      a.user_id, usr.username AS attendee_username
    FROM meetups m
    LEFT JOIN users u ON m.host_id = u.id
    LEFT JOIN attendees a ON m.id = a.meetup_id
    LEFT JOIN users usr ON a.user_id = usr.id
    WHERE m.id = $1;
  `;
  const { rows } = await pool.query(q, [meetupId]);
  if (rows.length === 0) return null;
  const base = {
    id: rows[0].id,
    title: rows[0].title,
    description: rows[0].description,
    location: rows[0].location,
    date: rows[0].date,
    time: rows[0].time,
    capacity: rows[0].capacity,
    host_name: rows[0].host_name,
    attendees: []
  };
  base.attendees = rows.filter(r => r.user_id).map(r => ({ user_id: r.user_id, username: r.attendee_username }));
  return base;
}
