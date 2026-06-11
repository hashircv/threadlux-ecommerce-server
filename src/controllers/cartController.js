import {
  addCartItem,
  listCartItems,
  removeCartItem,
  updateCartItem,
} from "../services/cartService.js";

export async function addToCart(req, res) {
  res.status(201).json(await addCartItem(req.user.id, req.body));
}

export async function getCart(req, res) {
  res.json(await listCartItems(req.user.id));
}

export async function removeFromCart(req, res) {
  res.json(await removeCartItem(req.user.id, req.params.productId));
}

export async function updateCartQuantity(req, res) {
  res.json(await updateCartItem(req.user.id, req.params.productId, req.body.quantity));
}
