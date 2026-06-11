import { Router } from "express";
import { getProductById, getProducts } from "../controllers/productController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getProducts));
router.get("/:id", asyncHandler(getProductById));

export default router;
