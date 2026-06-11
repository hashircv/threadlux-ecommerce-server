import { Router } from "express";
import {
  changeUserRole,
  createAdmin,
  deleteAdmin,
  getAdmins,
  getDashboard,
  getUsers,
} from "../controllers/adminController.js";

import {
  getAdminOrders,
  updateAdminOrderStatus,
} from "../controllers/orderController.js";

import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProducts,
  permanentlyDeleteAdminProduct,
  updateAdminProduct,
} from "../controllers/productController.js";

import {
  requireAuth,
  requireAdmin,
  requireSuperAdmin,
} from "../middleware/auth.js";

import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(requireAuth, requireAdmin);

/* Dashboard */
router.get("/dashboard", asyncHandler(getDashboard));

/* Users */
router.get("/users", asyncHandler(getUsers));

router.patch(
  "/users/:id/role",
  requireSuperAdmin,
  asyncHandler(changeUserRole)
);

/* ==========================
   SUPER ADMIN ROUTES
========================== */

router.get(
  "/admins",
  requireSuperAdmin,
  asyncHandler(getAdmins)
);

router.post(
  "/create-admin",
  requireSuperAdmin,
  asyncHandler(createAdmin)
);

router.delete(
  "/admins/:id",
  requireSuperAdmin,
  asyncHandler(deleteAdmin)
);

/* Products */
router.get("/products", asyncHandler(getAdminProducts));

router.post("/products", asyncHandler(createAdminProduct));

router.put("/products/:id", asyncHandler(updateAdminProduct));

router.patch(
  "/products/:id/deactivate",
  asyncHandler(deleteAdminProduct)
);

router.delete(
  "/products/:id",
  asyncHandler(permanentlyDeleteAdminProduct)
);

/* Orders */
router.get("/orders", asyncHandler(getAdminOrders));

router.patch(
  "/orders/:id/status",
  asyncHandler(updateAdminOrderStatus)
);

export default router;