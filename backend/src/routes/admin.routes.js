import { Router } from "express";
import { createProduct, getAllCustomers, getAllOrders, getAllProducts, getDashboardStats, updateOrderStatus, updateProduct } from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(protectRoute, adminOnly);

router.post("/products", upload.single("image"), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.single("image"), updateProduct);

router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus);

router.get("/customers", getAllCustomers);

router.get("/stats", getDashboardStats);

export default router;