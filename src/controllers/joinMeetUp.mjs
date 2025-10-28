
import { attendMeetupQuery, leaveMeetupQuery } from "../models/joinMeetUpModel.mjs";

export async function attendMeetup(req, res, next) {
  try {
    await attendMeetupQuery(req.user.id, req.params.id);
    res.json({ ok: true });
  } catch (e) {
    if (e.code === "MEETUP_FULL") return res.status(400).json({ message: "This meetup is full." });
    next(e);
  }
}

export async function leaveMeetup(req, res, next) {
  try {
    const ok = await leaveMeetupQuery(req.user.id, req.params.id);
    res.json({ ok });
  } catch (e) { next(e); }
}
