# Contexto Completo - Proyecto Don Palito Jr

## 📋 Información General del Proyecto

**Nombre:** Don Palito Jr - Sistema de Comercio Electrónico
**Tipo:** Aplicación web, móvil y panel administrativo para cafetería
**Estado:** Desarrollo completado — pendiente despliegue en producción
**Cliente:** Rosiris Buelvas Pedroza y Luis Eduardo Muñoz (Propietarios Cafetería Don Palito Junior)
**Equipo de Desarrollo:** Jair González Buelvas, Andrea Arcila Cano, Maicol Estiven Córdoba
**Institución:** SENA - Tecnología en Análisis y Desarrollo de Software
**Ubicación del Negocio:** Cra 47 76D Sur - 37, Sabaneta, Antioquia

---

## 🎯 Objetivo del Proyecto

Desarrollar un sistema integral de comercio electrónico para la Cafetería Don Palito Junior que permita:
- Modernizar la experiencia del cliente mediante una plataforma digital (web + mobile)
- Optimizar la gestión interna del negocio mediante un panel administrativo
- Expandir el alcance comercial más allá del público local
- Fortalecer la presencia digital manteniendo la esencia tradicional
- Automatizar procesos operativos (pagos, emails, facturas) y reducir errores
- Fomentar la fidelización mediante cupones y sistema de reseñas

---

## 🏪 Sobre el Negocio

**Don Palito Junior** es una cafetería tradicional colombiana especializada en:
- Buñuelos
- Palitos de queso
- Café y bebidas
- Productos típicos colombianos

**Contexto:** El negocio opera desde 2005 en Sabaneta, Antioquia. El proyecto busca adaptar la experiencia al canal digital, donde los clientes esperan realizar compras desde dispositivos móviles, pagar con tarjeta o transferencia, y tener una experiencia personalizada.

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico Completo

#### Frontend Web ✅ Completado (Jair González Buelvas)
- **Lenguajes:** HTML5, CSS3, JavaScript ES6+, JSX
- **Framework:** React 18.2.0 + Vite 5.0.8
- **Estilos:** Tailwind CSS 3.4.19 + DaisyUI 4.12.24
- **Estado del servidor:** @tanstack/react-query 5.90.21
- **Enrutamiento:** React Router DOM 6.30.3
- **Formularios:** React Hook Form 7.71.1 + Yup 1.7.1
- **HTTP / Auth:** Axios 1.13.5 + @clerk/clerk-react 5.60.1
- **Pagos:** @stripe/react-stripe-js 5.6.0 + @stripe/stripe-js 8.7.0
- **UI:** React Icons 4.12.0, React Toastify 9.1.3
- **Repo:** https://github.com/DarkerJB/donpalitojrweb.git

#### Frontend Mobile ✅ Completado (Andrea Arcila + Maicol Córdoba)
- **Framework:** React Native + Expo (Expo SDK 52)
- **Lenguaje:** TypeScript / TSX
- **Navegación:** Expo Router (file-based routing)
- **Autenticación:** Clerk Expo (@clerk/clerk-expo)
- **Plataformas:** iOS + Android
- **Repo:** https://github.com/[equipo]/ecommerce_app.git (READ-ONLY para Jair)

#### Admin Panel ✅ Completado (Maicol Córdoba)
- **Framework:** React 18 + Vite
- **Estilos:** Tailwind CSS
- **Autenticación:** Clerk (@clerk/clerk-react)
- **HTTP:** Axios
- **Acceso:** Solo usuarios con `sessionClaims.metadata.role === 'admin'`
- **Repo:** mismo repo `ecommerce_app/admin` (READ-ONLY para Jair)

#### Backend ✅ Completado (Andrea Arcila + Jair)
- **Entorno:** Node.js
- **Framework:** Express 5.2.1
- **Lenguaje:** JavaScript ES Modules
- **Arquitectura:** MVC (Modelo-Vista-Controlador)
- **API:** REST (documentación manual — no Swagger)
- **Autenticación:** @clerk/express (verifica JWT de Clerk en cada request protegido)
- **ODM:** Mongoose 8.19.3
- **Background jobs:** Inngest (sync-user: crea usuario en MongoDB al registrarse en Clerk)
- **Imágenes:** Cloudinary + Multer (subida en admin)
- **Pagos:** Stripe 19 (intención de pago + webhook para confirmar)
- **Emails:** Nodemailer (Gmail App Password)
- **Facturas:** PDFKit + csv-writer (se generan al pasar orden a "paid")
- **Repo:** `donpalitojrweb/backend` (Jair mantiene esta copia)

#### Base de Datos
- **Motor:** MongoDB
- **ODM:** Mongoose 8.19.3
- **Tipo:** NoSQL orientada a documentos
- **Hosting:** MongoDB Atlas (Cloud)

#### Servicios Externos
| Servicio | Uso |
|---|---|
| Clerk | Autenticación (registro, login, OAuth Google, JWT, webhooks) |
| MongoDB Atlas | Base de datos cloud |
| Cloudinary | Almacenamiento de imágenes de productos |
| Stripe | Pagos con tarjeta (PaymentIntent + webhook) |
| Inngest | Background job: sincronizar usuario Clerk → MongoDB |
| Nodemailer/Gmail | Emails transaccionales y facturas |
| ngrok | Túnel HTTPS para webhooks en desarrollo local |

#### Herramientas de Desarrollo
- **Editor:** Visual Studio Code
- **Testing API:** Postman
- **Diseño:** Figma
- **Base de Datos (local):** MongoDB Compass
- **Control de Versiones:** Git, GitHub
- **Diagramas:** PlantUML, Draw.io

---

## 📦 Estructura del Proyecto

```
donpalitojrweb/                    ← Repo de Jair
├── web/                           # Frontend Web — React + Vite
│   ├── src/
│   │   ├── assets/                # logos, imágenes estáticas
│   │   ├── components/
│   │   │   ├── common/            # Button, Badge, Loading, FilterBar, SearchBar…
│   │   │   ├── layout/            # Navbar, Footer
│   │   │   ├── products/          # ProductCard, ProductReviews
│   │   │   ├── checkout/          # StripeCheckoutForm, PaymentMethodSelector
│   │   │   └── profile/           # RatingModal, AddressForm, AddressCard…
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx    # useAuth, isAdmin (sessionClaims.role)
│   │   │   └── CartContext.jsx    # Carrito híbrido local/servidor
│   │   ├── hooks/
│   │   │   ├── useProducts.js     # React Query: lista de productos
│   │   │   ├── useProduct.js      # React Query: detalle de producto
│   │   │   ├── useServerCart.js   # Carrito en servidor (autenticado)
│   │   │   ├── useOrders.js       # Historial y detalle de pedidos
│   │   │   ├── useAddresses.js    # CRUD de direcciones de entrega
│   │   │   ├── useWishlist.js     # Lista de favoritos
│   │   │   ├── useReviews.js      # Reseñas de productos
│   │   │   └── useProfile.js      # Perfil: demografía, notificaciones, desactivar
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Hero, promos, favoritos, mapa
│   │   │   ├── Catalog.jsx        # Catálogo con filtros y búsqueda
│   │   │   ├── ProductDetail.jsx  # Detalle, reseñas, wishlist
│   │   │   ├── Cart.jsx           # Carrito con cupones
│   │   │   ├── InactiveAccount.jsx
│   │   │   ├── NotFound.jsx       # 404
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── PostLogin.jsx  # Redirect post-auth (admin o home)
│   │   │   ├── checkout/
│   │   │   │   ├── Checkout.jsx   # Stepper 3 pasos: dirección, pago, confirmación
│   │   │   │   └── CheckoutSuccess.jsx
│   │   │   ├── profile/
│   │   │   │   ├── Profile.jsx    # Tabs: Info, Pedidos, Direcciones, Wishlist
│   │   │   │   └── OrderDetail.jsx
│   │   │   └── info/
│   │   │       ├── About.jsx, Contact.jsx, FAQ.jsx
│   │   │       ├── Terms.jsx, Privacy.jsx, Cookies.jsx
│   │   ├── services/
│   │   │   ├── api.js             # Axios instance + interceptor Clerk + ACCOUNT_INACTIVE
│   │   │   └── index.js           # Funciones de servicio por módulo
│   │   ├── styles/
│   │   │   └── globals.css        # Tailwind + DaisyUI + animaciones custom
│   │   ├── utils/
│   │   │   ├── constants.js       # VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY…
│   │   │   ├── productHelpers.js  # formatCategoryLabel, helpers de productos
│   │   │   └── formatters.js      # formatCurrency (COP)
│   │   ├── App.jsx                # Router + rutas + ProtectedRoute + QueryClientProvider
│   │   └── main.jsx               # ClerkProvider + App
│   ├── public/                    # palitos.png, logo-color.png…
│   ├── docs/
│   │   ├── CHANGELOG.md
│   │   ├── contexto-don-palito-jr.md       ← este archivo
│   │   ├── GUIA-CLAUDE-CHAT-DOCUMENTACION.md
│   │   ├── ARRANCAR-PROYECTO.md
│   │   ├── cambio-backend-productos-publicos.md
│   │   ├── REQUISITOS FUNCIONALES.txt
│   │   └── REQUISITOS NO FUNCIONALES.txt
│   ├── .env                       # VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL, VITE_STRIPE_PUBLISHABLE_KEY
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/                       # Backend Node.js + Express 5
    └── src/
        ├── config/
        │   ├── db.js              # Conexión MongoDB Atlas
        │   ├── env.js             # Centraliza process.env con defaults
        │   └── inngest.js         # Inngest client + sync-user function
        ├── controllers/
        │   ├── admin.controller.js    # Dashboard, pedidos, clientes, estadísticas
        │   ├── auth.controller.js     # Endpoint de sincronización
        │   ├── cart.controller.js     # CRUD carrito servidor
        │   ├── coupon.controller.js   # CRUD cupones + validación + getActiveCoupons
        │   ├── order.controller.js    # Crear (transferencia), listar, detalle
        │   ├── payment.controller.js  # Stripe PaymentIntent + webhook + createTransferOrder
        │   ├── product.controller.js  # CRUD productos + Cloudinary
        │   ├── review.controller.js   # Crear y listar reseñas
        │   └── user.controller.js     # Perfil, direcciones, wishlist, notificaciones
        ├── middleware/
        │   ├── protectRoute.js        # Verifica JWT de Clerk
        │   ├── adminOnly.js           # Verifica role === 'admin'
        │   └── upload.js              # Multer (memoria) para imágenes
        ├── models/
        │   ├── user.model.js
        │   ├── product.model.js
        │   ├── cart.model.js
        │   ├── order.model.js
        │   ├── coupon.model.js
        │   └── review.model.js
        ├── routes/
        │   ├── admin.routes.js        # /api/admin/*
        │   ├── auth.routes.js         # /api/auth/*
        │   ├── cart.routes.js         # /api/cart/*
        │   ├── coupon.routes.js       # /api/coupons/*
        │   ├── order.routes.js        # /api/orders/*
        │   ├── payment.routes.js      # /api/payment/*
        │   ├── product.routes.js      # /api/products/*
        │   ├── review.routes.js       # /api/reviews/*
        │   └── user.routes.js         # /api/users/*
        ├── services/
        │   ├── email.service.js       # Nodemailer: bienvenida, pedidos, facturas, marketing
        │   └── invoice.service.js     # PDFKit (PDF) + csv-writer (CSV)
        └── server.js                  # Express app, CORS, rutas, puerto 3000

ecommerce_app/                     ← Repo de Andrea/Maicol (READ-ONLY para Jair)
├── mobile/                        # App Mobile — React Native + Expo
│   └── app/
│       ├── (auth)/
│       │   ├── login.tsx          # Login con Clerk SSO (Google, email)
│       │   └── sso-callback.tsx   # Callback OAuth
│       ├── (tabs)/
│       │   ├── index.tsx          # Home / Catálogo
│       │   ├── cart.tsx           # Carrito
│       │   └── profile.tsx        # Perfil básico
│       ├── product/
│       │   └── [id].tsx           # Detalle de producto
│       └── profile/
│           ├── orders.tsx         # Historial de pedidos
│           ├── wishlist.tsx       # Favoritos
│           ├── edit-profile.tsx   # Editar datos personales
│           ├── addresses.tsx      # Gestión de direcciones
│           ├── privacy-security.tsx
│           └── account-inactive.tsx
│
├── admin/                         # Admin Panel — React + Vite
│   └── src/
│       └── pages/
│           ├── LoginPage.jsx
│           ├── DashboardPage.jsx  # Estadísticas generales
│           ├── ProductsPage.jsx   # CRUD productos + imágenes
│           ├── CustomersPage.jsx  # Listar, activar/desactivar clientes
│           ├── OrdersPage.jsx     # Listar pedidos, cambiar estado
│           ├── CouponsPage.jsx    # Crear, editar, activar/desactivar cupones
│           └── UnauthorizedPage.jsx
│
└── backend/                       # Backend compartido (misma base que donpalitojrweb/backend)
```

---

## 🗃️ Modelo de Datos (MongoDB)

### Colecciones Activas: 6

> Nota: Los campos usan nombres en inglés (ES Modules, Mongoose 8). No existe colección de Inventario ni Analytics separada — el stock está en Product y las estadísticas se calculan en tiempo real.

#### 1. **Users** — sincronizado vía Inngest webhook desde Clerk
```js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String,        // "Casa", "Trabajo"
  street: String,
  city: String,
  department: String,
  zipCode: String,
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: String,
  email: { type: String, required: true, unique: true },
  imageUrl: String,
  role: { type: String, enum: ["user", "admin"], default: "user" },
  isActive: { type: Boolean, default: true },
  phone: String,
  documentType: String,   // CC | CE | Pasaporte | NIT
  documentNumber: String,
  gender: String,         // Masculino | Femenino | No binario | Prefiero no decirlo
  dateOfBirth: Date,
  addresses: [addressSchema],
  emailNotifications: { type: Boolean, default: true },
  marketingEmails: { type: Boolean, default: false },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
```

#### 2. **Products**
```js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: String,
  category: {
    type: String,
    enum: ["Palitos Premium", "Cocteleros", "Dulces", "Especiales", "Nuevos"],
    required: true,
  },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, default: 0 },
  images: [String],            // URLs de Cloudinary
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
```

#### 3. **Carts** — carrito del servidor (usuarios autenticados)
```js
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  cartItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
  }],
}, { timestamps: true });

export const Cart = mongoose.model("Cart", cartSchema);
```

#### 4. **Orders**
```js
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
  }],
  shippingAddress: {
    street: String,
    city: String,
    department: String,
    zipCode: String,
  },
  paymentMethod: { type: String, enum: ["stripe", "transferencia"], required: true },
  paymentResult: {
    id: String,           // "pi_..." (Stripe) | "transfer_..." (transferencia)
    status: String,
    update_time: String,
    email_address: String,
  },
  totalPrice: { type: Number, required: true },
  couponCode: String,
  discountAmount: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["pending", "paid", "in_preparation", "ready", "delivered", "canceled", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export const Order = mongoose.model("Order", orderSchema);
```

**Ciclo de vida del estado de orden:**
```
pending → paid → in_preparation → ready → delivered
pending → canceled (si no se paga)
paid/in_preparation → rejected (si hay problema)
```

#### 5. **Coupons**
```js
const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ["percentage", "fixed"], required: true },
  discountValue: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: Date,                          // null = sin expiración
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export const Coupon = mongoose.model("Coupon", couponSchema);
```

> `usedBy[]` garantiza que cada cupón sea de uso único por usuario (no se necesita un campo `firstOrderOnly`).

#### 6. **Reviews** — solo rating numérico (sin comentario de texto)
```js
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);
```

---

## 🔌 API REST — Endpoints

### Rutas públicas (sin autenticación)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/products` | Lista todos los productos activos |
| GET | `/api/products/:id` | Detalle de un producto |
| GET | `/api/coupons/active` | Cupones activos para carrusel del Home |
| POST | `/api/webhooks/clerk` | Webhook Clerk (Inngest sync-user) |
| POST | `/api/payment/webhook` | Webhook Stripe (confirmar pago) |

### Rutas protegidas (requieren token Clerk)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/cart` | Obtener carrito del usuario |
| POST | `/api/cart` | Agregar item al carrito |
| PUT | `/api/cart/:productId` | Actualizar cantidad |
| DELETE | `/api/cart/:productId` | Eliminar item del carrito |
| DELETE | `/api/cart` | Vaciar carrito |
| GET | `/api/orders` | Historial de pedidos del usuario |
| GET | `/api/orders/:id` | Detalle de pedido |
| POST | `/api/payment/create-intent` | Crear PaymentIntent de Stripe |
| POST | `/api/payment/create-transfer-order` | Crear orden de pago por transferencia |
| POST | `/api/coupons/validate` | Validar y calcular descuento de cupón |
| GET | `/api/users/profile` | Obtener perfil del usuario |
| PUT | `/api/users/profile` | Actualizar datos personales |
| PUT | `/api/users/notification-preferences` | Actualizar preferencias de notificaciones |
| PATCH | `/api/users/deactivate` | Desactivar cuenta (isActive: false) |
| GET | `/api/users/addresses` | Listar direcciones |
| POST | `/api/users/addresses` | Agregar dirección |
| PUT | `/api/users/addresses/:id` | Editar dirección |
| DELETE | `/api/users/addresses/:id` | Eliminar dirección |
| GET | `/api/users/wishlist` | Obtener wishlist |
| POST | `/api/users/wishlist/:productId` | Agregar a wishlist |
| DELETE | `/api/users/wishlist/:productId` | Eliminar de wishlist |
| GET | `/api/reviews/:productId` | Reseñas de un producto |
| POST | `/api/reviews` | Crear reseña (requiere pedido entregado) |

### Rutas de Admin (requieren token Clerk + role === 'admin')
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/admin/dashboard` | Estadísticas del dashboard |
| GET | `/api/admin/orders` | Listar todos los pedidos |
| PATCH | `/api/admin/orders/:id/status` | Cambiar estado de pedido |
| GET | `/api/admin/customers` | Listar clientes |
| PATCH | `/api/admin/customers/:id/status` | Activar/desactivar cliente |
| POST | `/api/products` | Crear producto (con imágenes Cloudinary) |
| PUT | `/api/products/:id` | Editar producto |
| DELETE | `/api/products/:id` | Eliminar producto |
| GET | `/api/coupons` | Listar todos los cupones |
| POST | `/api/coupons` | Crear cupón |
| PUT | `/api/coupons/:id` | Editar cupón |
| DELETE | `/api/coupons/:id` | Eliminar cupón |

---

## 🔑 Funcionalidades Principales

### Sistema para Clientes (Web + Mobile)

#### Catálogo de Productos
- ✅ Visualización de productos con imágenes (Cloudinary)
- ✅ Precios y disponibilidad en tiempo real
- ✅ Filtrado por categoría (5 categorías reales)
- ✅ Búsqueda de productos
- ✅ Vista detallada de producto con reseñas

#### Carrito de Compras
- ✅ Agregar/eliminar productos
- ✅ Modificar cantidades
- ✅ Calcular subtotales y total
- ✅ Aplicar cupones de descuento (porcentaje o monto fijo)
- ✅ Carrito híbrido: local (invitado) → servidor (autenticado) con transferencia automática

#### Gestión de Cuenta
- ✅ Registro de nuevos clientes (Clerk)
- ✅ Inicio de sesión seguro (email, Google — vía Clerk)
- ✅ Recuperación de contraseña vía Clerk
- ✅ Actualización de perfil (demografía, notificaciones)
- ✅ Historial de pedidos y detalle de cada pedido
- ✅ Gestión de direcciones de entrega (CRUD)
- ✅ Lista de favoritos (wishlist)
- ✅ Calificación de productos (1–5 estrellas) — solo para pedidos entregados
- ✅ Desactivar cuenta

#### Sistema de Pagos
- ✅ Pago con tarjeta mediante Stripe (PaymentIntent + webhooks)
- ✅ Pago por transferencia bancaria
- ✅ Confirmación por email al cliente y al admin al crear pedido
- ✅ Factura PDF + CSV enviada por email al confirmar pago (estado "paid")

#### Cupones y Descuentos
- ✅ Carrusel de cupones activos en el Home (público, sin login)
- ✅ Validación de cupón en checkout (activo, no expirado, no usado por el usuario)
- ✅ Descuento porcentual o monto fijo
- ✅ Uso único por usuario (controlado por `usedBy[]`)

### Sistema para Administradores (Admin Panel)

#### Dashboard
- ✅ Métricas clave (ventas, pedidos, clientes)
- ✅ Resumen de actividad reciente

#### Gestión de Productos
- ✅ Crear, editar, eliminar productos
- ✅ Subida de imágenes a Cloudinary
- ✅ Control de stock y estado activo/inactivo

#### Gestión de Pedidos
- ✅ Listar todos los pedidos con filtros
- ✅ Cambio de estado (7 estados)
- ✅ Email automático al cliente y admin en cada cambio de estado
- ✅ Generación de factura PDF + CSV al marcar como "paid"

#### Gestión de Clientes
- ✅ Listar clientes con datos completos
- ✅ Activar / desactivar cuenta de cliente

#### Gestión de Cupones
- ✅ Crear cupones (porcentaje o monto fijo)
- ✅ Editar cupones (código, valor, expiración)
- ✅ Activar / desactivar cupones
- ✅ Eliminar cupones
- ✅ Ver qué usuarios han usado cada cupón

---

## 🔐 Seguridad

### Autenticación y Autorización
- **Autenticación:** Clerk gestiona todo — registro, login, OAuth (Google), sesiones y JWT
- **Backend:** `@clerk/express` verifica el JWT de Clerk en `protectRoute` middleware
- **Roles:** `user` | `admin` — asignado en Clerk Dashboard (metadata.role), verificado en `adminOnly` middleware
- **Webhooks:** Clerk firma los webhooks con `CLERK_WEBHOOK_SECRET`; el backend verifica la firma antes de procesar

### Autenticación en el Frontend
- **Interceptor Axios:** `api.js` obtiene el token de Clerk con `getToken()` y lo adjunta en `Authorization: Bearer {token}`
- **Rutas protegidas:** `ProtectedRoute` en el frontend redirige a login si no está autenticado
- **Cuenta inactiva:** si el backend devuelve 403 con `code: 'ACCOUNT_INACTIVE'`, el interceptor redirige a `/cuenta-inactiva`

### Protección de Datos
- **Variables de entorno:** todas las claves sensibles en `.env` (no subir a git)
- **CORS:** `allowedOrigins: ['http://localhost:5173', 'http://localhost:5174']`
- **Stripe:** secretos de webhook verificados con `stripe.webhooks.constructEvent()`
- **HTTPS:** Comunicación segura en producción; ngrok provee HTTPS en desarrollo

---

## 🚀 Decisiones Técnicas Importantes

### ¿Por qué MongoDB?
- Flexibilidad para esquemas que evolucionan
- Excelente rendimiento con documentos anidados (pedidos con items, cupones con usedBy)
- Escalabilidad horizontal para crecimiento futuro
- MongoDB Atlas ofrece hosting gratuito para comenzar
- Integración natural con Node.js y Mongoose

### ¿Por qué Clerk en lugar de JWT propio?
- Elimina la necesidad de almacenar contraseñas (no hay bcrypt en el proyecto)
- Ofrece OAuth (Google) sin configuración adicional
- Webhooks para sincronizar usuarios al backend con Inngest
- Dashboard para gestionar usuarios y roles

### ¿Por qué React + Vite para el Web?
- Ecosistema maduro, gran comunidad
- Vite es significativamente más rápido que CRA
- Tailwind + DaisyUI agiliza el diseño sin CSS custom extenso

### ¿Por qué Expo para Mobile?
- Desarrollo multiplataforma (iOS + Android) con un solo codebase
- Expo Router simplifica la navegación con file-based routing
- Compatible con Clerk Expo para autenticación consistente con el web

### ¿Por qué Inngest?
- Gestión de background jobs sin infraestructura adicional
- Retry automático si el webhook de Clerk falla
- Dashboard visual para monitorear ejecuciones

### ¿Por qué Nodemailer + Gmail?
- Bajo costo (cuenta de Google con contraseña de aplicación)
- Suficiente para el volumen de un negocio pequeño
- Fácil configuración con Gmail App Password

### Consideraciones de Negocio
- El sistema debe ser intuitivo para clientes de todas las edades
- La identidad visual refleja la tradición de Don Palito Junior (colores cálidos, tipografía familiar)
- Integración con métodos de pago locales (transferencia bancaria)
- Facilidad de uso para propietarios con conocimientos técnicos limitados

---

## 📊 Estado Actual del Proyecto
> Última revisión: 1 de marzo de 2026 — v4.0

### ✅ Completado — Frontend Web (React + Vite)

Todas las fases de integración completadas:

- **Fase 0** — React Query configurado con `QueryClientProvider`
- **Fase 1** — `api.js` con interceptor Clerk (token en headers) + manejo `ACCOUNT_INACTIVE`
- **Fase 2** — Estructura dual Clerk/Mock para todos los hooks
- **Fase 3** — `useProducts`, `useProduct`, `productHelpers` — catálogo real del backend
- **Fase 4** — Carrito híbrido servidor/local (`useServerCart`, `CartContext` actualizado)
- **Fase 5** — Pedidos + Checkout con Stripe + Transferencia (payloads corregidos, cupones alineados)
- **Fase 6** — Direcciones (`useAddresses`) + Wishlist (`useWishlist`, botones en ProductCard/ProductDetail)
- **Fase 7** — Reseñas con backend (`useReviews`, `RatingModal` sin campo comentario)
- **Fase 8** — Redirect admin (`isAdmin` vía `sessionClaims.role`, `PostLogin.jsx`)
- **Perfil Extendido** — `useProfile` (demografía, notificaciones, desactivar cuenta)

Páginas completadas (20):
- Home, Catálogo, Detalle de Producto, Carrito, Checkout, CheckoutSuccess
- Login, Register, ForgotPassword, PostLogin
- Profile (tabs: Info Personal, Pedidos, Direcciones, Wishlist), OrderDetail
- About, Contact, FAQ, Terms, Privacy, Cookies
- InactiveAccount, 404 (NotFound)

### ✅ Completado — Backend (Node.js + Express 5)
- API REST completa (auth, products, cart, orders, coupons, reviews, users, admin, payment)
- Sistema de emails (Nodemailer): bienvenida, creación de pedido, cambio de estado, factura, marketing
- Facturas PDF + CSV (PDFKit + csv-writer) generadas al pasar orden a estado `"paid"`
- 7 estados de orden con emails automáticos en cada transición
- Rutas GET de productos públicas (catálogo sin login para web)
- `GET /coupons/active` — ruta pública para carrusel del Home
- `POST /payment/create-transfer-order` — flujo completo de pago por transferencia
- Rutas de perfil: `GET/PUT /profile`, `PUT /notification-preferences`, `PATCH /deactivate`
- `PATCH /admin/customers/:id/status` — activar/desactivar clientes desde el admin

### ✅ Completado — Mobile (React Native + Expo)
- App funcional en iOS y Android
- Autenticación Clerk SSO (Google, email/password)
- Tabs: Home/Catálogo, Carrito, Perfil
- Detalle de producto
- Perfil extendido: historial de pedidos, wishlist, editar perfil, gestión de direcciones, privacidad y seguridad
- Pantallas: cuenta inactiva, sso-callback

### ✅ Completado — Admin Panel (React)
- Login con verificación de rol admin (Clerk)
- Dashboard con estadísticas generales
- CRUD de productos con subida de imágenes a Cloudinary
- Gestión de clientes (listar, activar/desactivar)
- Gestión de pedidos (listar, cambiar estado → email automático al cliente)
- Gestión de cupones (crear, editar, activar/desactivar, eliminar)

### 🔄 Pendiente — General
- Despliegue en producción (hosting web, mobile store, backend cloud)
- Testing formal (QA — casos de prueba por RF)
- Documentación académica (6 documentos SENA)
- Capacitación a propietarios

---

## 📅 Cronograma General

**Duración estimada:** 18 semanas

### Sprints Planificados
- **Sprint 1-2:** Análisis, diseño y prototipos
- **Sprint 3-4:** Configuración inicial y autenticación
- **Sprint 5-6:** Módulo de productos y catálogo
- **Sprint 7-8:** Carrito de compras y pedidos
- **Sprint 9-10:** Panel administrativo
- **Sprint 11-12:** Sistema de reseñas y cupones
- **Sprint 13-14:** Sistema de emails y facturas
- **Sprint 15-16:** Aplicación móvil
- **Sprint 17:** Testing y correcciones
- **Sprint 18:** Despliegue y documentación

---

## 💰 Presupuesto

**Inversión Total:** $8.000.000 COP

### Desglose
- **Desarrollo (Personal):** $6.500.000
  - Diseño UX/UI: $1.000.000
  - Frontend Web: $2.000.000
  - Frontend Mobile: $1.500.000
  - Backend y BD: $3.000.000
  - Testing y Documentación: $800.000 (ajuste de suma al total)

- **Infraestructura:** $1.000.000
  - Dominio web
  - Hosting cloud
  - Servicios externos (Clerk, Cloudinary, Stripe, MongoDB Atlas)

- **Contingencia:** $500.000
  - Ajustes imprevistos
  - Pruebas adicionales

### Forma de Pago
- 50% al inicio (aprobación y firma)
- 30% a entrega de módulos funcionales
- 20% al finalizar (con documentación y capacitación)

---

## 🐛 Bugs Conocidos y Resueltos

### Bug 1: Botón outline invisible en temas DaisyUI
**Descripción:** `btn-outline + btn-primary` en globals.css causaba texto marrón sobre fondo marrón — invisible.
**Solución:** Cuando `outline=true`, solo aplicar `btn-outline` sin combinar con `btn-primary` en `Button.jsx`.
**Estado:** ✅ Resuelto

### Bug 2: Hamburguesa del Navbar no reabre tras scroll
**Descripción:** El tap en mobile generaba un micro-scroll que inmediatamente cerraba el menú.
**Solución:** `setTimeout(150ms)` antes de registrar el listener de click externo en `Navbar.jsx`.
**Estado:** ✅ Resuelto

### Bug 3: Checkout enviaba payload incorrecto al backend
**Descripción:** `couponCode` faltaba en el payload, el endpoint de transferencia era 404, `couponData.discountPercent` no existía.
**Solución:** Corregidos en `services/index.js` + `Checkout.jsx`: couponCode incluido, endpoint correcto (`/payment/create-transfer-order`), campo correcto `discountAmount`.
**Estado:** ✅ Resuelto

### Bug 4: CORS bloqueaba al admin en puerto 5174
**Descripción:** Cuando `web` tomaba el puerto 5173 y `admin` el 5174, el backend rechazaba requests del admin.
**Solución:** Agregar `http://localhost:5174` al array `allowedOrigins` en `backend/src/server.js`.
**Estado:** ✅ Resuelto

---

## 📝 Convenciones de Código

### JavaScript/Node.js (Backend)
- **Módulos:** ES Modules (`import`/`export`) — **no** CommonJS (`require`)
- **Estilo:** async/await, arrow functions
- **Nomenclatura:**
  - Variables y funciones: camelCase
  - Constantes globales: UPPER_SNAKE_CASE
  - Clases y modelos: PascalCase
  - Archivos de módulo: `nombre.controller.js`, `nombre.model.js`, `nombre.routes.js`
- **Idioma:** Variables y código en inglés; mensajes de error al usuario en español

### Estructura de Controlador (ES Modules)
```js
// controllers/product.controller.js
import { Product } from "../models/product.model.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error in getAllProducts:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
```

### Estructura de Modelo (ES Modules)
```js
// models/product.model.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: {
    type: String,
    enum: ["Palitos Premium", "Cocteleros", "Dulces", "Especiales", "Nuevos"],
    required: true,
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);
```

### Estructura de Rutas (ES Modules)
```js
// routes/product.routes.js
import { Router } from "express";
import { getAllProducts, getProductById, createProduct } from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
import { adminOnly } from "../middleware/adminOnly.js";

const router = Router();

router.get("/", getAllProducts);                           // público
router.get("/:id", getProductById);                       // público
router.post("/", protectRoute, adminOnly, createProduct); // solo admin

export default router;
```

### Git — Mensajes de Commit
- **Formato:** `tipo(alcance): descripción`
- **Tipos:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

```bash
git commit -m "feat(checkout): integrar pago por transferencia bancaria"
git commit -m "fix(navbar): corregir cierre accidental del menú mobile"
git commit -m "docs(contexto): actualizar estado del proyecto a v4.0"
```

---

## 📚 Referencias y Recursos

### Documentación Oficial
- [React 18](https://react.dev/)
- [Vite 5](https://vitejs.dev/)
- [Tailwind CSS 3](https://tailwindcss.com/docs)
- [DaisyUI 4](https://daisyui.com/)
- [TanStack Query 5](https://tanstack.com/query/v5)
- [Clerk React](https://clerk.com/docs/references/react/overview)
- [Express 5](https://expressjs.com/)
- [Mongoose 8](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://docs.mongodb.com/atlas/)
- [Stripe Node.js](https://stripe.com/docs/api)
- [Inngest](https://www.inngest.com/docs)
- [Nodemailer](https://nodemailer.com/)
- [Expo SDK 52](https://docs.expo.dev/)

### Librerías del Proyecto

#### Frontend Web
```json
{
  "react": "^18.2.0",
  "@clerk/clerk-react": "^5.60.1",
  "@tanstack/react-query": "^5.90.21",
  "@stripe/react-stripe-js": "^5.6.0",
  "@stripe/stripe-js": "^8.7.0",
  "react-router-dom": "^6.30.3",
  "react-hook-form": "^7.71.1",
  "yup": "^1.7.1",
  "axios": "^1.13.5",
  "react-icons": "^4.12.0",
  "react-toastify": "^9.1.3",
  "tailwindcss": "^3.4.19",
  "daisyui": "^4.12.24",
  "vite": "^5.0.8"
}
```

#### Backend
```json
{
  "express": "^5.2.1",
  "mongoose": "^8.19.3",
  "@clerk/express": "latest",
  "inngest": "latest",
  "cloudinary": "latest",
  "multer": "latest",
  "stripe": "^19.x",
  "nodemailer": "latest",
  "pdfkit": "^0.17.2",
  "csv-writer": "^1.6.0",
  "dotenv": "latest",
  "cors": "latest",
  "express-rate-limit": "latest"
}
```

### Herramientas de Desarrollo
- **Editor:** Visual Studio Code
- **Testing API:** Postman
- **Diseño:** Figma
- **Base de Datos (local):** MongoDB Compass
- **Control de Versiones:** Git, GitHub
- **Diagramas:** PlantUML, Draw.io
- **Pagos (dev):** Stripe CLI (`stripe listen --forward-to localhost:3000/api/payment/webhook`)
- **Túnel HTTPS (dev):** ngrok (`ngrok http 3000`)

---

## 👥 Equipo de Desarrollo

### Desarrolladores
| Nombre | Rol |
|---|---|
| **Jair González Buelvas** (DarkerJB) | Frontend Web (React + Vite) + Backend (co-mantenedor) |
| **Andrea Arcila Cano** | Backend (Node.js + Express) + Mobile |
| **Maicol Estiven Córdoba** | Mobile (Expo/React Native) + Admin Panel |

### Cliente
- **Rosiris Buelvas Pedroza** — Propietaria
- **Luis Eduardo Muñoz** — Propietario
- **Email:** luchodonpalito@gmail.com
- **Teléfono:** +57 314 870 2078

### Institución
- **SENA** — Servicio Nacional de Aprendizaje
- **Programa:** Tecnología en Análisis y Desarrollo de Software

---

## 📌 Notas Importantes

### Sobre el Proyecto
- Este es un proyecto formativo del SENA con cliente real
- Se debe mantener comunicación constante con los propietarios
- La documentación académica (6 documentos) es parte fundamental de la evaluación
- El proyecto debe estar completamente funcional y desplegado al finalizar

### Repositorios
- **donpalitojrweb** (Jair): Contiene `web/` y `backend/` — es el repo de trabajo activo
- **ecommerce_app** (Andrea/Maicol): Contiene `mobile/`, `admin/` y `backend/` — READ-ONLY para Jair (solo leer para analizar cambios del backend compartido)

### Mejores Prácticas
- Commits pequeños y frecuentes con mensajes descriptivos
- No subir `.env` ni credenciales al repositorio
- Variables de entorno para todas las claves sensibles
- Backup regular de la base de datos
- Testear con Stripe CLI antes de integrar webhooks

### Comunicación con el Cliente
- Reuniones quincenales de seguimiento
- Demos al final de cada sprint
- Validación de diseños antes de implementar

---

## 🎯 Criterios de Éxito

### Técnico
- ✅ Sistema web completamente funcional
- ✅ Aplicación móvil operativa
- ✅ Panel administrativo funcional
- ✅ API REST completa
- ✅ Sistema de pagos (Stripe + transferencia)
- ✅ Sistema de emails y facturas
- 🔄 Testing completo (pendiente)
- 🔄 Despliegue en producción (pendiente)

### Funcional
- ✅ Clientes pueden navegar y comprar productos
- ✅ Administradores pueden gestionar todo el sistema
- ✅ Sistema de pagos operativo
- ✅ Reseñas y cupones funcionando
- 🔄 Reportes avanzados (pendiente expansión)

### Negocio
- 🔄 Propietarios capacitados en el uso
- 🔄 Manual de usuario entregado
- 🔄 Sistema desplegado en producción
- 🔄 Documentación académica entregada

---

## 🚀 Comandos de Arranque (Desarrollo Local)

Ver `ARRANCAR-PROYECTO.md` para instrucciones completas. Resumen:

```bash
# Terminal 1 — Backend (puerto 3000 + Inngest 8288)
cd D:\1_donpalitojr\donpalitojrweb\backend
npm run dev:all

# Terminal 2 — ngrok (túnel HTTPS para webhooks Clerk)
ngrok http 3000
# Copiar URL → actualizar en Clerk Dashboard → Webhooks

# Terminal 3 — Frontend Web (puerto 5173)
cd D:\1_donpalitojr\donpalitojrweb\web
npm run dev

# Terminal 4 — Stripe CLI (opcional, para probar webhooks de pago)
stripe listen --forward-to localhost:3000/api/payment/webhook
```

---

**Última actualización:** 1 de marzo de 2026
**Versión del documento:** 4.0 (Sistema completo — Web + Mobile + Admin + Backend)
**Mantenido por:** Jair González Buelvas (DarkerJB)
