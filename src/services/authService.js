import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

function buildToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}

export async function registerUser({ name, email, password }) {
  const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rows[0]) {
    throw new AppError("Email already exists", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, 'customer')
     RETURNING id, name, email, role, created_at`,
    [name, email, passwordHash]
  );
  const user = result.rows[0];

  return { user: publicUser(user), token: buildToken(user) };
}

export async function loginUser({ email, password }) {
  const result = await query(
    "SELECT id, name, email, password_hash, role, created_at FROM users WHERE email = $1",
    [email]
  );
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    throw new AppError("Invalid credentials", 401);
  }

  return { user: publicUser(user), token: buildToken(user) };
}
