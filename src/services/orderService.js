import { pool, query } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

export async function listUserOrders(userId) {
  const ordersResult = await query(
    "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );

  return Promise.all(ordersResult.rows.map(withOrderItems));
}

export async function listAllOrders() {
  const result = await query(
    `SELECT o.*, u.name AS customer_name, u.email AS customer_email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`
  );

  return Promise.all(result.rows.map(withOrderItems));
}

export async function createOrderFromCart(userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cartResult = await client.query(
      `SELECT c.product_id, c.quantity, p.price, p.name, p.image_url
       FROM cart_items c
       JOIN products p ON p.id = c.product_id
       WHERE c.user_id = $1`,
      [userId]
    );

    if (!cartResult.rows.length) {
      throw new AppError("Cart is empty", 400);
    }

    const total = cartResult.rows.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const orderRes = await client.query(
      `INSERT INTO orders (user_id, total_amount, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, total, "PENDING"]
    );
    const order = orderRes.rows[0];

    for (const item of cartResult.rows) {
      await client.query(
        `INSERT INTO order_items
         (order_id, product_id, product_name, product_image, quantity, unit_price)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [order.id, item.product_id, item.name, item.image_url, item.quantity, item.price]
      );
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
    await client.query("COMMIT");

    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateOrderStatus(orderId, status) {
  const allowedStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

  if (!allowedStatuses.includes(status)) {
    throw new AppError(`status must be one of ${allowedStatuses.join(", ")}`, 400);
  }

  const result = await query("UPDATE orders SET status = $1 WHERE id = $2 RETURNING *", [
    status,
    orderId,
  ]);

  if (!result.rows[0]) {
    throw new AppError("Order not found", 404);
  }

  return result.rows[0];
}

async function withOrderItems(order) {
  const itemsResult = await query(
    `SELECT product_id, product_name, product_image, quantity, unit_price
     FROM order_items
     WHERE order_id = $1`,
    [order.id]
  );

  return { ...order, items: itemsResult.rows };
}
