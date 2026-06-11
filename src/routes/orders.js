import { Router } from "express";
import { createOrder, getOrders } from "../controllers/orderController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getOrders));
router.post("/", asyncHandler(createOrder));

export default router;
