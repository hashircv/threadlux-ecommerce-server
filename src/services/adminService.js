import bcrypt from "bcrypt";
import { query } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

export async function getDashboardStats() {
  const [users, products, orders, revenue, pendingOrders] =
    await Promise.all([
      query("SELECT COUNT(*)::int AS count FROM users"),
      query(
        "SELECT COUNT(*)::int AS count FROM products WHERE is_active = true"
      ),
      query("SELECT COUNT(*)::int AS count FROM orders"),
      query(
        "SELECT COALESCE(SUM(total_amount), 0)::numeric AS total FROM orders WHERE status != 'CANCELLED'"
      ),
      query(
        "SELECT COUNT(*)::int AS count FROM orders WHERE status IN ('PENDING', 'PROCESSING')"
      ),
    ]);

  const recentOrders = await query(
    `SELECT
        o.id,
        o.total_amount,
        o.status,
        o.created_at,
        u.name AS customer_name
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC
     LIMIT 5`
  );

  return {
    users: users.rows[0].count,
    products: products.rows[0].count,
    orders: orders.rows[0].count,
    revenue: Number(revenue.rows[0].total),
    pendingOrders: pendingOrders.rows[0].count,
    recentOrders: recentOrders.rows,
  };
}

export async function listUsers() {
  const result = await query(
    `SELECT
        id,
        name,
        email,
        role,
        created_at
     FROM users
     ORDER BY created_at DESC`
  );

  return result.rows;
}

export async function updateUserRole(userId, role) {
  const allowedRoles = ["admin", "customer"];

  if (!allowedRoles.includes(role)) {
    throw new AppError(
      `role must be one of ${allowedRoles.join(", ")}`,
      400
    );
  }

  const result = await query(
    `UPDATE users
     SET role = $1
     WHERE id = $2
     RETURNING
       id,
       name,
       email,
       role,
       created_at`,
    [role, userId]
  );

  if (!result.rows[0]) {
    throw new AppError("User not found", 404);
  }

  return result.rows[0];
}

/* ==========================
   SUPER ADMIN FUNCTIONS
========================== */

export async function createAdminAccount({
  name,
  email,
  password,
}) {
  const existingUser = await query(
    `SELECT id
     FROM users
     WHERE email = $1`,
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new AppError(
      "Email already exists",
      400
    );
  }

  const passwordHash = await bcrypt.hash(
    password,
    10
  );

  const result = await query(
    `INSERT INTO users
      (
        name,
        email,
        password_hash,
        role
      )
     VALUES
      (
        $1,
        $2,
        $3,
        'admin'
      )
     RETURNING
      id,
      name,
      email,
      role,
      created_at`,
    [
      name,
      email,
      passwordHash,
    ]
  );

  return result.rows[0];
}

export async function listAdmins() {
  const result = await query(
    `SELECT
        id,
        name,
        email,
        role,
        created_at
     FROM users
     WHERE role IN
      (
        'admin',
        'super_admin'
      )
     ORDER BY created_at DESC`
  );

  return result.rows;
}

export async function removeAdmin(adminId) {
  const result = await query(
    `DELETE FROM users
     WHERE id = $1
     AND role = 'admin'
     RETURNING id`,
    [adminId]
  );

  if (!result.rows[0]) {
    throw new AppError(
      "Admin not found or cannot delete super admin",
      404
    );
  }

  return {
    success: true,
  };
}