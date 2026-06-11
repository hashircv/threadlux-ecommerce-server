import { Router } from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cartController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.use(requireAuth);

router.post("/", asyncHandler(addToCart));
router.get("/", asyncHandler(getCart));
router.delete("/:productId", asyncHandler(removeFromCart));
router.put("/:productId", asyncHandler(updateCartQuantity));

export default router;
