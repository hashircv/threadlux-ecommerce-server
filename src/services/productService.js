import { query } from "../config/db.js";
import { AppError } from "../utils/AppError.js";

const productFields =
  "id, name, description, image_url, image_urls, price, category, rating, stock, is_active, created_at";

function normalizeImages(data) {
  const imageUrls = Array.isArray(data.image_urls)
    ? data.image_urls.map((url) => String(url).trim()).filter(Boolean)
    : [];
  const primaryImage = String(data.image_url || imageUrls[0] || "").trim();

  return {
    image_url: primaryImage,
    image_urls: imageUrls.length ? imageUrls : primaryImage ? [primaryImage] : [],
  };
}

export async function listProducts({ includeInactive = false } = {}) {
  const where = includeInactive ? "" : "WHERE is_active = true";
  const result = await query(`SELECT ${productFields} FROM products ${where} ORDER BY id`);
  return result.rows;
}

export async function getProduct(id, { includeInactive = false } = {}) {
  const activeClause = includeInactive ? "" : "AND is_active = true";
  const result = await query(
    `SELECT ${productFields} FROM products WHERE id = $1 ${activeClause}`,
    [id]
  );

  if (!result.rows[0]) {
    throw new AppError("Product not found", 404);
  }

  return result.rows[0];
}

export async function createProduct(data) {
  const images = normalizeImages(data);
  const result = await query(
    `INSERT INTO products (name, description, image_url, image_urls, price, category, rating, stock, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${productFields}`,
    [
      data.name,
      data.description,
      images.image_url,
      images.image_urls,
      data.price,
      data.category || null,
      data.rating ?? 4,
      data.stock ?? 0,
      data.is_active ?? true,
    ]
  );

  return result.rows[0];
}

export async function updateProduct(id, data) {
  const current = await getProduct(id, { includeInactive: true });
  const next = { ...current, ...data };
  const images = normalizeImages(next);

  const result = await query(
    `UPDATE products
     SET name = $1, description = $2, image_url = $3, image_urls = $4, price = $5,
         category = $6, rating = $7, stock = $8, is_active = $9
     WHERE id = $10
     RETURNING ${productFields}`,
    [
      next.name,
      next.description,
      images.image_url,
      images.image_urls,
      next.price,
      next.category,
      next.rating,
      next.stock,
      next.is_active,
      id,
    ]
  );

  return result.rows[0];
}

export async function deleteProduct(id) {
  const result = await query(
    `UPDATE products SET is_active = false WHERE id = $1 RETURNING ${productFields}`,
    [id]
  );

  if (!result.rows[0]) {
    throw new AppError("Product not found", 404);
  }

  return result.rows[0];
}

export async function permanentlyDeleteProduct(id) {
  const orderItems = await query("SELECT id FROM order_items WHERE product_id = $1 LIMIT 1", [id]);

  if (orderItems.rows[0]) {
    throw new AppError("Product has order history and cannot be permanently deleted", 409);
  }

  await query("DELETE FROM cart_items WHERE product_id = $1", [id]);
  const result = await query(`DELETE FROM products WHERE id = $1 RETURNING ${productFields}`, [id]);

  if (!result.rows[0]) {
    throw new AppError("Product not found", 404);
  }

  return result.rows[0];
}
