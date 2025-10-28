
import { createMeetup } from "../models/meetupModel.mjs";

export async function createMeetupController(req, res, next) {
  try {
    const { title, description, location, date, time, capacity } = req.body;
    const host_id = req.user?.id;
    if (!host_id) return res.status(401).json({ message: "Unauthorized" });
    if (!title || !location || !date || !time) return res.status(400).json({ message: "Missing fields" });
    const created = await createMeetup({ title, description, location, date, time, host_id, capacity });
    res.status(201).json(created);
  } catch (e) { next(e); }
}
