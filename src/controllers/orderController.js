import {
  createOrderFromCart,
  listAllOrders,
  listUserOrders,
  updateOrderStatus,
} from "../services/orderService.js";

export async function getOrders(req, res) {
  res.json(await listUserOrders(req.user.id));
}

export async function createOrder(req, res) {
  const order = await createOrderFromCart(req.user.id);
  res.status(201).json({ message: "Order created successfully", order });
}

export async function getAdminOrders(_req, res) {
  res.json(await listAllOrders());
}

export async function updateAdminOrderStatus(req, res) {
  res.json(await updateOrderStatus(req.params.id, req.body.status));
}
