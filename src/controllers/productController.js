import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  permanentlyDeleteProduct,
  updateProduct,
} from "../services/productService.js";
import { AppError } from "../utils/AppError.js";

function validateProductInput(data, partial = false) {
  const required = ["name", "description", "price"];

  if (!partial) {
    for (const field of required) {
      if (data[field] === undefined || data[field] === "") {
        throw new AppError(`${field} is required`, 400);
      }
    }
  }

  if (!partial && !data.image_url && !data.image_urls?.length) {
    throw new AppError("At least one product image is required", 400);
  }

  if (data.image_urls !== undefined && !Array.isArray(data.image_urls)) {
    throw new AppError("image_urls must be an array", 400);
  }

  if (data.price !== undefined && Number(data.price) < 0) {
    throw new AppError("price must be zero or more", 400);
  }

  if (data.stock !== undefined && Number(data.stock) < 0) {
    throw new AppError("stock must be zero or more", 400);
  }
}

export async function getProducts(_req, res) {
  res.json(await listProducts());
}

export async function getProductById(req, res) {
  res.json(await getProduct(req.params.id));
}

export async function getAdminProducts(_req, res) {
  res.json(await listProducts({ includeInactive: true }));
}

export async function createAdminProduct(req, res) {
  validateProductInput(req.body);
  res.status(201).json(await createProduct(req.body));
}

export async function updateAdminProduct(req, res) {
  validateProductInput(req.body, true);
  res.json(await updateProduct(req.params.id, req.body));
}

export async function deleteAdminProduct(req, res) {
  res.json(await deleteProduct(req.params.id));
}

export async function permanentlyDeleteAdminProduct(req, res) {
  res.json(await permanentlyDeleteProduct(req.params.id));
}
