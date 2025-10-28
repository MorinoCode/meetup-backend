
import { getAllMeetups, getMeetupDetails } from "../models/meetupModel.mjs";

export async function listMeetups(req, res, next) {
  try {
    const { search = '', dateFilter = '', dateFrom = '', dateTo = '' } = req.query;
    const data = await getAllMeetups({ search, dateFilter, dateFrom, dateTo });
    res.json(data);
  } catch (e) { next(e); }
}

export async function listMeetupsDetails(req, res, next) {
  try {
    const details = await getMeetupDetails(req.params.id);
    if (!details) return res.status(404).json({ message: "Not found" });
    res.json(details);
  } catch (e) { next(e); }
}
