
import { getUserProfile } from "../models/profileModel.mjs";

export async function getProfile(req, res, next) {
  try {
    const data = await getUserProfile(req.user.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  } catch (e) { next(e); }
}
