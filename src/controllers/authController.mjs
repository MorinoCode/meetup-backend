
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { registerUser, getUserByEmail, comparePassword } from "../models/authModel.mjs";

dotenv.config();

export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: "Missing fields" });
    const created = await registerUser(username, email, password);
    if (!created) return res.status(409).json({ message: "Email already exists" });
    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET || "devsecret", { expiresIn: "7d" });
    res.json({ token, id: user.id, username: user.username });
  } catch (e) { next(e); }
}
