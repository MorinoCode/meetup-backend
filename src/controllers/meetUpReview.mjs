
import { addOrUpdateReview, getMeetupReviews } from "../models/reviewModel.mjs";

export async function addReview(req, res, next) {
  try {
    const { rating, comment } = req.body;
    const data = await addOrUpdateReview(req.user.id, req.params.id, Number(rating), comment ?? null);
    res.status(201).json(data);
  } catch (e) { next(e); }
}

export async function getReviews(req, res, next) {
  try {
    const list = await getMeetupReviews(req.params.id);
    res.json(list);
  } catch (e) { next(e); }
}
