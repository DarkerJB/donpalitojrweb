import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createPaymentIntent, createTransferOrder } from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-intent", protectRoute, createPaymentIntent);
router.post("/create-transfer-order", protectRoute, createTransferOrder);

export default router;