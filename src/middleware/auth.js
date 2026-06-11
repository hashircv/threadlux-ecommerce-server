import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export function requireAdmin(req, res, next) {
 if (
  req.user?.role !== "admin" &&
  req.user?.role !== "super_admin"
){
    return res.status(403).json({ message: "Admin access required" });
  }

  return next();
}

export function requireSuperAdmin(req, res, next) {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({
      message: "Super Admin access required",
    });
  }

  next();
}
