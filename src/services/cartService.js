import { query } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

export async function addCartItem(userId, { productId, quantity = 1 }) {
  if (!productId) {
    throw new AppError("productId is required", 400);
  }

  if (Number(quantity) < 1) {
    throw new AppError("quantity must be at least 1", 400);
  }

  await query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, product_id)
     DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
    [userId, productId, quantity]
  );

  return { message: "Product added to cart" };
}

export async function listCartItems(userId) {
  const result = await query(
    `SELECT c.product_id, c.quantity, p.name, p.price, p.image_url
     FROM cart_items c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1
     ORDER BY c.created_at DESC`,
    [userId]
  );
  return result.rows;
}

export async function removeCartItem(userId, productId) {
  await query("DELETE FROM cart_items WHERE user_id = $1 AND product_id = $2", [userId, productId]);
  return { message: "Product removed from cart" };
}

export async function updateCartItem(userId, productId, quantity) {
  if (Number(quantity) < 1) {
    throw new AppError("Quantity must be at least 1", 400);
  }

  const result = await query(
    `UPDATE cart_items
     SET quantity = $1
     WHERE user_id = $2 AND product_id = $3
     RETURNING *`,
    [quantity, userId, productId]
  );

  if (result.rowCount === 0) {
    throw new AppError("Cart item not found", 404);
  }

  return { message: "Quantity updated successfully", item: result.rows[0] };
}
