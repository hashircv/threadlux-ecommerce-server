import {
  getDashboardStats,
  listUsers,
  updateUserRole,
  createAdminAccount,
  listAdmins,
  removeAdmin,
} from "../services/adminService.js";

export async function getDashboard(_req, res) {
  res.json(await getDashboardStats());
}

export async function getUsers(_req, res) {
  res.json(await listUsers());
}

export async function changeUserRole(req, res) {
  res.json(await updateUserRole(req.params.id, req.body.role));
}

/* ==========================
   SUPER ADMIN FUNCTIONS
========================== */

export async function getAdmins(_req, res) {
  res.json(await listAdmins());
}

export async function createAdmin(req, res) {
  const admin = await createAdminAccount(req.body);

  res.status(201).json(admin);
}

export async function deleteAdmin(req, res) {
  await removeAdmin(req.params.id);

  res.json({
    message: "Admin deleted successfully",
  });
}