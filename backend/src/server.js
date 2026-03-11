import express from "express";
import path from "path";
import os from "os";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import cors from "cors";

import { functions, inngest } from "./config/inngest.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { handleWebhook } from "./controllers/payment.controller.js"; // ← importar directo

import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js"
import reviewRoutes from "./routes/review.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js"
import couponRoutes from "./routes/coupon.routes.js";
import "./services/email.service.js";

const app = express();
const __dirname = path.resolve();

const corsOptions = {
  origin: ENV.NODE_ENV === "production" 
    ? ENV.CLIENT_URL  
    : function (origin, callback) {
        if (!origin) return callback(null, true);
        const localPatterns = [
          /^http:\/\/localhost(:\d+)?$/,
          /^http:\/\/127\.0\.0\.1(:\d+)?$/,
          /^http:\/\/10\.0\.2\.2(:\d+)?$/,
          /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
          /^http:\/\/172\.\d+\.\d+\.\d+(:\d+)?$/,
          /^exp:\/\//,
        ];
        if (localPatterns.some((pattern) => pattern.test(origin))) return callback(null, true);
        callback(new Error('Not allowed by CORS'));
      },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'clerk-session-id']
};

app.use(cors(corsOptions));

// ✅ WEBHOOK ANTES DE TODO - raw body sin tocar
app.post(
  "/api/payment/webhook",
  express.raw({ type: "*/*" }),
  handleWebhook
);

// Resto de middlewares después del webhook
app.use(express.json());
app.use(clerkMiddleware());

app.post("/api/webhooks/clerk", async (req, res) => {
  const event = req.body;
  console.log("Webhook received:", event.type);
  try {
    await inngest.send({
      name: `clerk/${event.type}`,
      data: event.data,
    });
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error sending event to Inngest:", error);
    res.status(500).json({ error: "Inngest error" });
  }
});

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes); // ← ya sin lógica especial del webhook
app.use("/api/coupons", couponRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success" });
});

if (ENV.NODE_ENV !== "production") {
    app.get("/", (req, res) => {
        res.json({ message: "API funcionando correctamente", status: "ok" });
    });
}

if (ENV.NODE_ENV === "production") {
    app.use("/admin", express.static(path.join(__dirname, "../admin/dist")));
    app.get("/admin/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin/dist/index.html"));
    });
    app.use(express.static(path.join(__dirname, "../web/dist")));
    app.get("/{*any}", (req, res, next) => {
        if (req.path.startsWith("/api") || req.path.startsWith("/admin")) return next();
        res.sendFile(path.join(__dirname, "../web/dist/index.html"));
    });
}

const getNetworkIPs = () => {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) ips.push(config.address);
    }
  }
  return ips;
};

const startServer = async () => {
    await connectDB();
    const HOST = '0.0.0.0';
    const PORT = ENV.PORT || 3000;
    app.listen(PORT, HOST, () => {
      const networkIPs = getNetworkIPs();
      console.log('🚀 Server is up and running!');
      console.log(`💻 Local:        http://localhost:${PORT}`);
      networkIPs.forEach(ip => console.log(`📱 Network:      http://${ip}:${PORT}`));
      console.log(`🌍 Environment:  ${ENV.NODE_ENV || 'development'}`);
    });
};

startServer();