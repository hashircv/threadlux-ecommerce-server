import { loginUser, registerUser } from "../services/authService.js";
import { AppError } from "../utils/AppError.js";

export async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError("name, email and password are required", 400);
  }

  res.status(201).json(await registerUser({ name, email, password }));
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("email and password are required", 400);
  }

  res.json(await loginUser({ email, password }));
}
