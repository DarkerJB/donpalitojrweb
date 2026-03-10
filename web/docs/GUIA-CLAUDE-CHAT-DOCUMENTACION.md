# Guía de Documentación — Don Palito Jr.
### Instrucciones para Claude Chat

---

## ⚠️ INSTRUCCIONES DE USO (leer primero)

**Para Jair (quien adjunta este archivo):**
Este documento es el insumo principal que debes adjuntar al inicio de cada conversación con Claude Chat para construir la documentación del proyecto. Trabaja un documento a la vez. Para cada documento, Claude Chat te indicará exactamente qué archivos adicionales necesitas adjuntar.

**Para Claude Chat (quien lee este documento):**
1. Lee este documento completo antes de hacer cualquier pregunta o generar contenido.
2. Trabaja UN documento a la vez. No intentes generar todos juntos.
3. Para cada documento: primero confirma qué archivos adicionales necesitas que Jair adjunte, luego construye sección por sección.
4. Los diagramas UML para la ERS debes generarlos en código **PlantUML** (para que Jair los renderice en [plantuml.com](https://plantuml.com)) o en texto estructurado tipo tabla si PlantUML no es viable.
5. Todos los documentos deben estar redactados en **español formal**.
6. Si hay conflicto entre información de insumos viejos y este documento, **prioriza la información de esta guía**.
7. El stack, las páginas, los modelos y los endpoints que aquí se describen son el estado **actual y definitivo** del proyecto (25 de febrero de 2026).

---

## SECCIÓN 1 — CONTEXTO GENERAL DEL PROYECTO

### 1.1 Información del negocio

| Campo | Valor |
|---|---|
| **Nombre** | Cafetería Don Palito Jr. |
| **Clientes** | Rosiris Buelvas y Luis Eduardo Muñoz |
| **Ubicación** | Cra 47 #76D Sur - 37, Sabaneta, Antioquia, Colombia |
| **Teléfono** | +57 314 870 2078 |
| **Email admin** | luchodonpalito@gmail.com |
| **Producto principal** | Buñuelos, palitos de queso, café — tradición colombiana desde 2005 |
| **Objetivo del proyecto** | Modernizar el negocio con un sistema e-commerce completo: tienda web, app móvil y panel de administración |
| **Presupuesto** | $8.000.000 COP |

### 1.2 Equipo de desarrollo (SENA — Aprendices)

| Nombre | Rol |
|---|---|
| Jair González Buelvas (GitHub: DarkerJB) | Frontend Web |
| Andrea Arcila (GitHub: andreaac777) | Backend + Mobile |
| Maicol Córdoba | Mobile + Admin Panel |

### 1.3 Repositorios

| Repositorio | URL | Responsable |
|---|---|---|
| Web + Backend propio | https://github.com/DarkerJB/donpalitojrweb.git | Jair |
| Backend + Mobile + Admin (referencia) | https://github.com/andreaac777/ecommerce_app | Andrea/Maicol |

---

### 1.4 Stack tecnológico completo

#### Frontend Web (`donpalitojrweb/web`)

| Tecnología | Versión | Rol |
|---|---|---|
| React | 18.2.0 | UI framework |
| Vite | 5.0.8 | Bundler / dev server |
| React Router DOM | 6.30.3 | Enrutamiento SPA |
| Tailwind CSS | 3.4.19 | Estilos utilitarios |
| DaisyUI | 4.12.24 | Componentes UI (design system) |
| @tanstack/react-query | 5.90.21 | Server state management / caché |
| @clerk/clerk-react | 5.60.1 | Autenticación (JWT + OAuth) |
| @clerk/localizations | (incluido) | Localización en español |
| @stripe/react-stripe-js | 5.6.0 | Componentes de pago Stripe |
| @stripe/stripe-js | 8.7.0 | SDK Stripe cliente |
| Axios | 1.13.5 | Cliente HTTP |
| React Hook Form | 7.71.1 | Manejo de formularios |
| @hookform/resolvers | 3.10.0 | Integración Yup con RHF |
| Yup | 1.7.1 | Validación de esquemas |
| React Icons | 4.12.0 | Iconografía (io5) |
| React Toastify | 9.1.3 | Notificaciones toast |
| moment | 2.30.1 | Formateo de fechas |
| react-to-print | (instalado) | Generación PDF en cliente |

#### Backend (`donpalitojrweb/backend`)

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | (ES Modules) | Runtime |
| Express | 5.2.1 | Framework servidor HTTP |
| MongoDB | (Atlas) | Base de datos NoSQL |
| Mongoose | 8.19.3 | ODM para MongoDB |
| @clerk/express | 1.7.63 | Autenticación Clerk en servidor |
| Inngest | 3.49.3 | Background jobs (sync usuarios) |
| Cloudinary | 2.8.0 | Almacenamiento y CDN de imágenes |
| Multer | 2.0.2 | Upload de archivos |
| Stripe | 19.3.1 | Pasarela de pago |
| Nodemailer | 8.0.1 | Envío de emails (Gmail) |
| PDFKit | 0.17.2 | Generación de facturas PDF |
| csv-writer | 1.6.0 | Exportación CSV |
| cors | 2.8.5 | CORS |
| dotenv | 17.2.3 | Variables de entorno |
| nodemon | 3.1.11 | Recarga en desarrollo |
| concurrently | 9.2.1 | Ejecutar múltiples procesos |

#### Mobile (`ecommerce_app/mobile`)
- React Native + Expo (equipo de Andrea y Maicol)

#### Admin Panel (`ecommerce_app/admin`)
- React (equipo de Maicol)

---

### 1.5 Arquitectura del sistema

```
┌─────────────────────────────────────────────────────┐
│                  CLIENTES                           │
│  Web (React)   Mobile (RN/Expo)   Admin (React)    │
└────────────────────────┬────────────────────────────┘
                         │ REST API (HTTP/HTTPS)
                         ▼
┌─────────────────────────────────────────────────────┐
│            BACKEND — Node.js + Express 5            │
│  Puerto 3000 — MongoDB Atlas — Clerk Auth           │
│  Inngest (jobs) — Cloudinary (imgs) — Stripe        │
│  Nodemailer (emails) — PDFKit (facturas)            │
└─────────────────────────────────────────────────────┘
                         │
┌────────────┬───────────┼────────────────────────────┐
│  MongoDB   │  Clerk    │  Cloudinary  │  Stripe      │
│  Atlas     │  (auth)   │  (imágenes)  │  (pagos)     │
└────────────┴───────────┴──────────────┴─────────────┘
```

**Autenticación centralizada:** Clerk gestiona usuarios via JWT. Al registrarse un usuario, Clerk envía un webhook al backend → Inngest procesa el evento → crea el usuario en MongoDB → envía email de bienvenida.

---

### 1.6 Páginas del Frontend Web (completadas al 25/02/2026)

| Página | Ruta | Descripción |
|---|---|---|
| Home | `/` | Hero, productos destacados, promociones activas (carrusel), mapa |
| Catálogo | `/catalogo` | Grid de productos con filtros por categoría y búsqueda |
| Detalle de Producto | `/producto/:id` | Imagen, descripción, precio, botón carrito, favoritos, reseñas |
| Carrito | `/carrito` | Lista de ítems, cantidades, totales |
| Checkout | `/checkout` | Stepper: dirección → método de pago → confirmación, cupón |
| Checkout Éxito | `/checkout/exito` | Confirmación del pedido + botón WhatsApp |
| Login | `/login` | Clerk SignIn con glassmorphism, fondo hero, español |
| Registro | `/registro` | Clerk SignUp con mismo diseño |
| Recuperar Contraseña | `/recuperar-contrasena` | Flujo Clerk |
| Post-Login | `/post-login` | Redirect automático según rol (admin → panel admin, cliente → home) |
| Perfil | `/perfil` | Tabs: Info Personal, Mis Pedidos, Direcciones, Favoritos |
| Detalle de Pedido | `/perfil/pedidos/:id` | Estado del pedido, productos, timeline, descarga factura |
| Sobre Nosotros | `/nosotros` | Historia, valores, CTA |
| Contacto | `/contacto` | Formulario de contacto |
| Preguntas Frecuentes | `/preguntas-frecuentes` | FAQ accordion |
| Términos | `/terminos` | Términos y condiciones |
| Privacidad | `/privacidad` | Política de privacidad |
| Cookies | `/cookies` | Política de cookies |
| Cuenta Inactiva | `/cuenta-inactiva` | Página cuando el admin desactiva una cuenta |
| 404 | `*` | Página no encontrada |

---

### 1.7 Colecciones MongoDB (modelos Mongoose)

#### `users`
```
clerkId (String, unique)
name (String)
email (String, unique)
imageUrl (String)
phone (String)
addresses (Array de subdocumentos)
  └── street, city, state, zipCode, isDefault
isActive (Boolean, default: true)
emailNotifications (Boolean, default: true)
marketingEmails (Boolean, default: false)
documentType (String: CC/CE/Pasaporte)
documentNumber (String)
gender (String: Masculino/Femenino/No especificado)
dateOfBirth (Date)
createdAt, updatedAt (timestamps)
```

#### `products`
```
name (String, required)
description (String)
price (Number, required)
category (String: enum 5 categorías)
stock (Number, default: 0)
images (Array de Strings — URLs Cloudinary)
isAvailable (Boolean, default: true)
createdAt, updatedAt
```

#### `carts`
```
userId (ObjectId → User)
items (Array)
  └── product (ObjectId → Product), quantity (Number)
createdAt, updatedAt
```

#### `orders`
```
user (ObjectId → User)
clerkId (String)
orderItems (Array)
  └── product (ObjectId → Product), name, image, price, quantity
shippingAddress (subdocumento)
  └── street, city, state, zipCode
paymentMethod (String: stripe | transferencia)
paymentResult (subdocumento)
  └── id, status, updateTime, emailAddress
itemsPrice (Number)
shippingPrice (Number, default: 0)
totalPrice (Number)
couponCode (String)
discountAmount (Number, default: 0)
status (String: enum)
  └── pending | paid | in_preparation | ready | delivered | canceled | rejected
hasReviewed (Boolean, default: false)
createdAt, updatedAt
```

#### `coupons`
```
code (String, unique, uppercase)
discountType (String: percentage | fixed)
discountValue (Number)
expiresAt (Date, nullable)
isActive (Boolean, default: true)
usedBy (Array de ObjectId → User)
createdAt, updatedAt
```

#### `reviews`
```
product (ObjectId → Product)
user (ObjectId → User)
clerkId (String)
rating (Number: 1–5)
createdAt, updatedAt
```

---

### 1.8 Categorías de Productos

Las 5 categorías reales del negocio:
1. **Palitos Premium**
2. **Cocteleros**
3. **Dulces**
4. **Especiales**
5. **Nuevos**

---

### 1.9 API REST — Endpoints completos

**Base URL (desarrollo):** `http://localhost:3000`
**Auth:** Clerk JWT — header `Authorization: Bearer <token>` gestionado automáticamente por `@clerk/express`

#### Productos
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/products` | ❌ Público | Listar todos los productos activos |
| GET | `/api/products/:id` | ❌ Público | Detalle de un producto |
| POST | `/api/products` | ✅ Admin | Crear producto |
| PUT | `/api/products/:id` | ✅ Admin | Actualizar producto |
| DELETE | `/api/products/:id` | ✅ Admin | Eliminar producto |

#### Carrito
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/cart` | ✅ Clerk | Obtener carrito del usuario |
| POST | `/api/cart` | ✅ Clerk | Agregar ítem al carrito |
| PUT | `/api/cart/:itemId` | ✅ Clerk | Actualizar cantidad |
| DELETE | `/api/cart/:itemId` | ✅ Clerk | Eliminar ítem |
| DELETE | `/api/cart` | ✅ Clerk | Vaciar carrito completo |

#### Órdenes
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/orders` | ✅ Clerk | Listar pedidos del usuario |

#### Cupones
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/coupons/active` | ❌ Público | Listar cupones activos (para Home) |
| POST | `/api/coupons/validate` | ✅ Clerk | Validar un cupón en checkout |
| GET | `/api/coupons` | ✅ Admin | Listar todos los cupones |
| POST | `/api/coupons` | ✅ Admin | Crear cupón |
| PUT | `/api/coupons/:id` | ✅ Admin | Actualizar cupón |
| DELETE | `/api/coupons/:id` | ✅ Admin | Eliminar cupón |

#### Reseñas
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/reviews` | ✅ Clerk | Crear reseña (rating 1–5, sin comentario) |

#### Pagos
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/payment/create-intent` | ✅ Clerk | Crear PaymentIntent de Stripe |
| POST | `/api/payment/create-transfer-order` | ✅ Clerk | Crear pedido por transferencia bancaria |
| POST | `/api/payment/webhook` | ❌ Stripe | Webhook de Stripe (firma verificada) |

#### Usuarios / Perfil
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/users/profile` | ✅ Clerk | Obtener perfil extendido |
| PUT | `/api/users/profile` | ✅ Clerk | Actualizar datos demográficos |
| PUT | `/api/users/notification-preferences` | ✅ Clerk | Actualizar notificaciones |
| PATCH | `/api/users/deactivate` | ✅ Clerk | Desactivar cuenta propia |
| GET | `/api/users/wishlist` | ✅ Clerk | Listar favoritos |
| POST | `/api/users/wishlist` | ✅ Clerk | Agregar a favoritos |
| DELETE | `/api/users/wishlist/:productId` | ✅ Clerk | Quitar de favoritos |
| GET | `/api/users/addresses` | ✅ Clerk | Listar direcciones |
| POST | `/api/users/addresses` | ✅ Clerk | Agregar dirección |
| PUT | `/api/users/addresses/:id` | ✅ Clerk | Actualizar dirección |
| DELETE | `/api/users/addresses/:id` | ✅ Clerk | Eliminar dirección |

#### Admin
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/admin/orders` | ✅ Admin | Listar todos los pedidos |
| PATCH | `/api/admin/orders/:id/status` | ✅ Admin | Cambiar estado de pedido |
| GET | `/api/admin/customers` | ✅ Admin | Listar clientes |
| PATCH | `/api/admin/customers/:id/status` | ✅ Admin | Activar/desactivar cliente |

#### Webhooks
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/webhooks/clerk` | Firma Clerk | Sync de usuarios (user.created) |

---

### 1.10 Flujos de negocio clave

#### Flujo de compra con Stripe
```
1. Cliente agrega productos al carrito
2. Va a Checkout → selecciona dirección, aplica cupón (opcional)
3. Selecciona "Tarjeta" → POST /payment/create-intent (backend valida stock + cupón, crea PaymentIntent)
4. Cliente ingresa datos de tarjeta en formulario Stripe (test: 4242 4242 4242 4242)
5. Stripe confirma pago → dispara evento payment_intent.succeeded
6. Backend recibe webhook POST /payment/webhook → crea orden en MongoDB (status: paid)
7. Backend reduce stock de cada producto
8. Backend marca cupón como usado (coupon.usedBy)
9. Backend envía email al cliente y al admin (Promise.allSettled)
10. Frontend redirige a /checkout/exito con botón WhatsApp
```

#### Flujo de compra por transferencia bancaria
```
1. Cliente agrega productos al carrito
2. Va a Checkout → selecciona dirección, aplica cupón (opcional)
3. Selecciona "Transferencia" → POST /payment/create-transfer-order
4. Backend valida stock, valida cupón, crea orden (status: pending), reduce stock, marca cupón
5. Backend envía emails
6. Frontend redirige a /checkout/exito
7. Cliente envía comprobante de pago por WhatsApp
8. Admin valida manualmente y cambia estado del pedido vía panel admin
```

#### Flujo de autenticación
```
1. Usuario se registra en Clerk (web o mobile)
2. Clerk envía POST /api/webhooks/clerk (evento: user.created)
3. Backend verifica firma con CLERK_WEBHOOK_SECRET
4. Publica evento clerk.user.created a Inngest
5. Función sync-user de Inngest ejecuta:
   a. Busca usuario en MongoDB (por clerkId)
   b. Si no existe: User.create() con datos de Clerk
   c. Envía email de bienvenida (sendWelcomeEmail, fire-and-forget)
6. Al hacer login: Clerk emite JWT → frontend lo adjunta en cada request via Axios interceptor
7. Backend verifica JWT con @clerk/express → req.user disponible en controladores
```

#### Flujo de validación de cupón
```
1. En Checkout, usuario ingresa código y hace clic en "Aplicar"
2. POST /api/coupons/validate { code, subtotal }
3. Backend verifica: isActive, expiresAt, alreadyUsed (coupon.usedBy contiene el user._id)
4. Si válido: retorna { coupon: { code, discountType, discountValue }, discountAmount }
5. Frontend muestra descuento; al confirmar pedido, couponCode se envía en el payload
6. Al crear la orden: Coupon.findOneAndUpdate({ code }, { $addToSet: { usedBy: user._id } })
```

#### Ciclo de vida de un pedido (estados)
```
pending → (admin valida pago) → paid → in_preparation → ready → delivered
                             ↘ canceled / rejected
```

---

### 1.11 Sistema de emails y facturas

Al crear un pedido (ambos métodos de pago):
- `sendOrderCreatedAdminEmail` — notifica al admin
- `sendOrderCreatedClientEmail` — confirma al cliente

Al cambiar estado del pedido (desde admin panel):
- Estado `paid`: genera factura PDF + CSV → `sendInvoiceEmails` (adjunta factura al cliente y admin)
- Otros estados: `sendOrderUpdatedAdminEmail` + `sendOrderUpdatedClientEmail`

Al registrar usuario: `sendWelcomeEmail` (fire-and-forget)

**Formato de número de factura:** `FV-{año}-{últimos 8 chars del orderId en mayúsculas}`

---

### 1.12 Estructura de carpetas del proyecto

```
donpalitojrweb/
├── web/                          # Frontend React
│   ├── src/
│   │   ├── App.jsx               # Router + ClerkProvider + QueryClient
│   │   ├── main.jsx
│   │   ├── components/
│   │   │   ├── auth/             # ProtectedRoute.jsx, AdminRoute.jsx
│   │   │   ├── cart/             # CartItem.jsx, EmptyCart.jsx, OrderSummary.jsx
│   │   │   ├── checkout/         # CheckoutStepper, PaymentMethodSelector, StripeCheckoutForm
│   │   │   ├── common/           # Badge, Button, Card, Input, Loading, Modal, Rating, ScrollToTop
│   │   │   ├── layout/           # Navbar, Footer, Header, Layout
│   │   │   ├── products/         # ProductCard.jsx
│   │   │   ├── profile/          # AddressCard, AddressForm, OrderTimeline, RatingModal
│   │   │   └── providers/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Catalog.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── AccountInactive.jsx
│   │   │   ├── auth/             # Login, Register, ForgotPassword, ResetPassword, PostLogin
│   │   │   ├── checkout/         # Checkout, CheckoutSuccess
│   │   │   ├── info/             # About, Contact, Privacy, Terms, Cookies, FAQ
│   │   │   └── profile/          # Profile, Orders, OrderDetail, Wishlist
│   │   ├── hooks/
│   │   │   ├── useProducts.js    # React Query — lista de productos
│   │   │   ├── useProduct.js     # React Query — producto individual
│   │   │   ├── useServerCart.js  # Carrito híbrido (local → servidor)
│   │   │   ├── useOrders.js      # Pedidos del usuario
│   │   │   ├── useAddresses.js   # CRUD de direcciones
│   │   │   ├── useWishlist.js    # Favoritos
│   │   │   ├── useReviews.js     # Mutation para crear reseñas
│   │   │   └── useProfile.js     # Perfil extendido + notificaciones + desactivar
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx   # isAuthenticated, isAdmin, user
│   │   │   └── CartContext.jsx   # Estado global del carrito
│   │   ├── services/
│   │   │   ├── api.js            # Axios + interceptor Clerk + manejo ACCOUNT_INACTIVE
│   │   │   └── index.js          # productService, cartService, orderService, couponService,
│   │   │                         # paymentService, reviewService, userService, couponService
│   │   ├── utils/
│   │   │   ├── constants.js      # PRODUCT_CATEGORIES, ORDER_STATUS_LABELS, PAYMENT_METHODS
│   │   │   ├── formatters.js     # formatCurrency, formatDate
│   │   │   ├── validationSchemas.js  # Yup schemas
│   │   │   ├── productHelpers.js # getProductImage, getProductPrice
│   │   │   └── whatsappHelpers.js
│   │   └── styles/
│   │       └── globals.css       # Variables CSS custom, animaciones, DaisyUI overrides
│   ├── docs/                     # Esta carpeta — documentación del proyecto
│   └── public/
│       └── palitos.png           # Imagen de palitos de queso (logo/background)
│
└── backend/
    └── src/
        ├── server.js             # Express app, CORS, rutas
        ├── config/
        │   ├── db.js             # Conexión MongoDB
        │   ├── env.js            # Variables de entorno centralizadas
        │   ├── cloudinary.js     # Config Cloudinary
        │   └── inngest.js        # Función sync-user (background jobs)
        ├── models/               # user, product, cart, order, coupon, review
        ├── routes/               # user, product, cart, order, coupon, review, payment, admin, webhook
        ├── controllers/          # Lógica de cada recurso
        ├── middleware/           # auth.middleware.js (protectRoute, adminOnly)
        └── services/
            ├── email.service.js  # Nodemailer — 7 funciones de email
            └── invoice.service.js # PDFKit + csv-writer — generateInvoicePDF, generateInvoiceCSV
```

---

### 1.13 Variables de entorno

#### `web/.env`
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_ADMIN_URL=http://localhost:5174
```

#### `backend/.env`
```env
NODE_ENV=development
PORT=3000
DB_URL=mongodb+srv://...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
CLOUDINARY_CLOUD_NAME=...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
INNGEST_SIGNING_KEY=
# Empresa (para facturas):
LOGO_URL=
COMPANY_NAME=Don Palito Junior
COMPANY_NIT=900.123.456-7
COMPANY_ADDRESS=Cra 47 #76D Sur - 37
COMPANY_CITY=Sabaneta, Antioquia
COMPANY_PHONE=+57 314 870 2078
# Email:
ADMIN_EMAIL=luchodonpalito@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

---

### 1.14 Comandos de arranque

```bash
# Terminal 1 — Backend + Inngest
cd D:\1_donpalitojr\donpalitojrweb\backend
npm run dev:all

# Terminal 2 — Túnel ngrok (necesario para webhooks de Clerk)
ngrok http 3000

# Terminal 3 — Frontend
cd D:\1_donpalitojr\donpalitojrweb\web
npm run dev
# Acceder en http://localhost:5173

# (Opcional) Terminal 4 — Stripe CLI
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

**Reiniciar frontend:** `h + Enter`, luego `q + Enter`, luego `npm run dev`

---

## SECCIÓN 2 — REQUISITOS FUNCIONALES (texto oficial)

```
RF-01 El sistema debe permitir a los usuarios registrarse como clientes
RF-02 El sistema debe permitir a los clientes iniciar sesión en su cuenta con sus credenciales.
RF-03 El sistema debe proporcionar un mecanismo para que los clientes recuperen su contraseña olvidada y puedan acceder de nuevo a su cuenta.
RF-04 El sistema debe permitir al cliente modificar su perfil.
RF-05 El sistema debe permitir a los clientes cerrar su sesión de forma segura.
RF-06 El sistema debe permitir al cliente desactivar su cuenta.
RF-07 El sistema debe mostrar a los clientes un catálogo de los productos disponibles.
RF-08 El sistema debe mostrar a los clientes los detalles de un producto (imagen, nombre, descripción, precio y disponibilidad).
RF-09 El sistema debe permitir a los clientes aplicar un filtro de ordenamiento alfabéticamente y por precio.
RF-10 El sistema debe incluir una función de búsqueda rápida que permita a los clientes encontrar productos específicos.
RF-11 El sistema debe mostrar claramente a los clientes las promociones vigentes en la página principal.
RF-12 El sistema debe permitir a los clientes agregar productos al carrito de compras.
RF-13 El sistema debe permitir a los clientes modificar o eliminar productos del carrito de compras.
RF-14 El sistema debe permitir a los clientes cancelar la compra de los productos en su carrito.
RF-15 El sistema debe permitir a los clientes finalizar la compra de los productos en su carrito.
RF-16 El sistema debe permitir que, una vez el cliente decida finalizar la compra de los productos en su carrito, sea redirigido a una sección de check-out, donde se aprecien los detalles de la compra (productos, cantidades, subtotal, iva, descuentos, total), datos de facturación (nombre, documento de identidad, dirección y teléfono) y QR de pago.
RF-17 El sistema debe permitir a los clientes ingresar y aplicar códigos de descuento válidos durante el proceso de compra.
RF-18 El sistema debe proporcionar a los clientes un enlace de WhatsApp para que estos puedan enviar sus comprobantes de pago.
RF-19 El sistema permitir a los clientes recibir una factura de su compra, una vez se confirme su pago.
RF-20 El sistema debe permitir a los clientes recibir notificaciones vía correo electrónico sobre el estado de sus pedidos.
RF-21 El sistema debe permitir a los clientes acceder en su perfil al historial de pedidos.
RF-22 El sistema debe permitir a los clientes calificar y dejar reseñas de los productos que han comprado.
RF-23 El sistema debe permitir a los clientes solicitar personalizaciones especificas en los empaques.
RF-24 El sistema debe permitir a los clientes acceder a la ubicación de la cafetería en un mapa interactivo.
RF-25 El sistema debe permitir a los nuevos administradores registrarse en el sistema proporcionando sus credenciales y datos de contacto.
RF-26 El sistema debe permitir a los administradores iniciar sesión de forma segura.
RF-27 El sistema debe permitir a los administradores cerrar su sesión de forma segura.
RF-28 El sistema debe permitir a los administradores recuperar y cambiar su contraseña.
RF-29 El sistema debe permitir a los administradores editar o modificar cuentas de usuario existentes.
RF-30 El sistema debe permitir a los administradores desactivar o eliminar cuentas de usuario.
RF-31 El sistema debe permitir a los administradores con sesión activa reactivar cuentas previamente desactivadas o eliminadas.
RF-32 El sistema debe permitir a los administradores agregar productos al inventario.
RF-33 El sistema debe permitir a los administradores modificar productos del inventario.
RF-34 El sistema debe permitir a los administradores eliminar productos del inventario.
RF-35 El sistema debe permitir a los administradores crear categorías de productos.
RF-36 El sistema debe permitir a los administradores modificar categorías de productos.
RF-37 El sistema debe permitir a los administradores eliminar categorías de productos.
RF-38 El sistema debe permitir a los administradores crear promociones y descuentos.
RF-39 El sistema debe permitir a los administradores modificar promociones y descuentos existentes.
RF-40 El sistema debe permitir a los administradores eliminar o desactivar promociones y descuentos.
RF-41 El sistema debe permitir al administrador registrar manualmente el estado del pedido (pendiente, pagado, rechazado, entregado).
RF-42 El sistema debe actualizar el estado del pedido a "Pagado" o "Rechazado" según la validación del pago por parte del administrador.
RF-43 El sistema debe permitir al administrador enviar correos electrónicos a los clientes notificando el estado de su pedido.
RF-44 El sistema debe mostrar a los administradores una lista de todos los pedidos realizados.
RF-45 El sistema debe permitir al administrador visualizar las facturas para cada compra realizada.
RF-46 El sistema debe permitir al administrador paginar las facturas de cada compra realizada.
RF-47 El sistema debe permitir a los administradores moderar los comentarios y calificaciones de los productos.
RF-48 El sistema debe permitir a los administradores gestionar líneas de atención al cliente para brindar soporte.
RF-49 El sistema debe permitir a los administradores ver estadísticas de los productos.
RF-50 El sistema debe permitir a los administradores exportar datos de ventas, inventario y clientes en formatos comunes (CSV, PDF).
RF-51 El sistema debe permitir a los administradores generar informes de ventas por período.
```

---

## SECCIÓN 3 — REQUISITOS NO FUNCIONALES (texto oficial)

### Prioridad Alta

| ID | Nombre | Descripción |
|---|---|---|
| RNF-01 | Seguridad | El sistema debe implementar medidas de seguridad para proteger contra ataques y accesos no autorizados. |
| RNF-02 | Tiempo de Carga | El sistema debe cargar en menos de 3 segundos en una conexión de red estándar. |
| RNF-03 | Disponibilidad | El sistema debe estar disponible 24/7 con un tiempo de inactividad mínimo. |
| RNF-04 | Compatibilidad de Navegadores | La página web debe ser compatible con los principales navegadores (Chrome, Firefox, Safari, Edge). |
| RNF-05 | Responsividad | La interfaz de usuario debe ser completamente responsiva, adaptándose a dispositivos móviles, tablets y escritorio. |
| RNF-06 | Escalabilidad | El sistema debe ser escalable para manejar un aumento en el tráfico de usuarios sin afectar el rendimiento. |
| RNF-07 | Cumplimiento Legal | La página web debe cumplir con todas las leyes y regulaciones locales sobre privacidad y protección de datos. |

### Prioridad Media

| ID | Nombre | Descripción |
|---|---|---|
| RNF-08 | Usabilidad | La interfaz de usuario debe ser intuitiva y fácil de usar. |
| RNF-09 | Mantenibilidad | El código debe estar bien documentado y seguir estándares de codificación para facilitar su mantenimiento. |
| RNF-10 | Rendimiento | El sistema debe mantener un rendimiento óptimo bajo carga máxima esperada. |
| RNF-11 | Recuperación | El sistema debe permitir una rápida recuperación en caso de fallo grave. |
| RNF-12 | Integración de API | El sistema debe integrarse de manera efectiva con APIs de mapas y pagos. |
| RNF-13 | Auditoría | El sistema debe mantener registros de auditoría para todas las transacciones financieras y cambios en el inventario. |
| RNF-14 | Actualizaciones y Parcheo | El sistema debe permitir la instalación de actualizaciones y parches de manera fácil. |

### Prioridad Baja

| ID | Nombre | Descripción |
|---|---|---|
| RNF-15 | Accesibilidad | La página web debe cumplir con pautas de accesibilidad. |
| RNF-16 | Carga de Recursos | Los recursos de la página web deben cargarse en menos de 1 segundo en conexiones de banda ancha. |
| RNF-17 | Compatibilidad con versiones anteriores | Las actualizaciones del sistema no deben afectar la funcionalidad de las versiones de la API utilizadas por aplicaciones de tercero. |
| RNF-18 | Gestión de caché | Implementar un sistema de caché para reducir la carga del servidor y mejorar los tiempos de respuesta. |
| RNF-19 | Soporte de copias de seguridad | El sistema debe realizar copias de seguridad automáticas. |
| RNF-20 | Eficiencia Energética | El sistema debe estar diseñado para ser eficiente en términos de consumo de recursos. |

---

## SECCIÓN 4 — DOCUMENTOS A CONSTRUIR

> **⚠️ ALCANCE DE TODOS LOS DOCUMENTOS:** Cada uno de los 6 documentos debe cubrir el **sistema completo**: Web + Mobile + Admin + Backend. No te limites al frontend web.

---

### Insumos comunes — pedir para TODOS los documentos

Independientemente del documento que se esté construyendo, solicita siempre estos 3 insumos a Jair:

| Insumo | Ruta en el equipo de Jair | Para qué sirve |
|---|---|---|
| Estructura de carpetas de **mobile** | `D:\1_donpalitojr\ecommerce_app\mobile` | Conocer las pantallas de la app móvil |
| Estructura de carpetas de **admin** | `D:\1_donpalitojr\ecommerce_app\admin` | Conocer las páginas del panel de administración |
| Estructura de carpetas de **backend** | `D:\1_donpalitojr\ecommerce_app\backend` | Confirmar la estructura del backend compartido |

**Contexto conocido de estos componentes** (para no partir de cero):

**Mobile** (`ecommerce_app/mobile`) — Expo/React Native, 14 pantallas:
- Auth: Login con Clerk (SSO + email)
- Tabs: Home/Catálogo, Carrito, Perfil básico
- Producto: Detalle de producto (`[id].tsx`)
- Perfil extendido: Historial de pedidos, Lista de deseos (Wishlist), Editar perfil, Gestión de direcciones, Privacidad y seguridad
- Otros: Cuenta inactiva, SSO callback

**Admin** (`ecommerce_app/admin`) — React, 7 páginas:
- Login admin (Clerk)
- Dashboard con estadísticas generales
- Gestión de Productos (CRUD + imágenes Cloudinary)
- Gestión de Clientes (listar, activar/desactivar cuentas)
- Gestión de Pedidos (listar, cambiar estados + email automático)
- Gestión de Cupones (crear, editar, activar/desactivar, eliminar)
- Página No Autorizado

**Backend** (`ecommerce_app/backend`) — Node.js + Express + MongoDB (mismo stack que el backend de Jair; es el backend compartido del equipo completo)

---

### Documento 1 — Manual de Usuario

**Estado:** Actualizar base existente
**Alcance:** Sistema completo — Web (clientes) + Mobile (clientes) + Admin (administradores)
**Resultado esperado:** Documento Word (.docx) en español formal con lenguaje sencillo

#### Archivos que debes pedirle a Jair:
1. `1. Manual de Usuario Don Palito Jr rmk2 09122025.docx` — en `D:\1_donpalitojr\Insumos Documentación Proyecto 2026\` — **documento base (ya incluye secciones web y mobile)**
2. Estructura de carpetas de `ecommerce_app/mobile` *(ver insumos comunes)*
3. Estructura de carpetas de `ecommerce_app/admin` *(ver insumos comunes)*
4. Estructura de carpetas de `ecommerce_app/backend` *(ver insumos comunes)*

#### Instrucciones:
1. Pide primero el .docx base y léelo completo antes de hacer cambios.
2. La **sección Mobile** del documento base **consérvala tal como está** — ya estaba correcta.
3. La **sección Web** actualízala con las nuevas funcionalidades implementadas desde diciembre 2025 hasta febrero 2026 (ver Sección 1.5 de esta guía para la lista completa de páginas actuales).
4. Agrega una **sección Admin** nueva basada en las 7 páginas conocidas del panel.
5. Usa lenguaje sencillo y amigable. Este documento es para usuarios finales, no para desarrolladores.

#### Secciones mínimas requeridas:
1. Introducción y propósito del sistema
2. Requisitos por plataforma: Web (navegadores compatibles), Mobile (iOS/Android), Admin (navegadores)
3. **SECCIÓN WEB — Para clientes:**
   - Registro e inicio de sesión (email + Google)
   - Recuperación de contraseña
   - Navegación del catálogo (búsqueda, filtros por categoría)
   - Detalle de producto y agregar al carrito
   - Gestión del carrito (modificar cantidades, eliminar)
   - Proceso de checkout: dirección → cupón de descuento → pago con tarjeta (Stripe) → pago por transferencia bancaria + comprobante WhatsApp
   - Confirmación y seguimiento del estado del pedido
   - Gestión de perfil (datos personales, preferencias de notificación)
   - Historial de pedidos y descarga de factura
   - Lista de favoritos (Wishlist)
   - Calificar productos (rating con estrellas)
   - Cerrar sesión y desactivar cuenta
4. **SECCIÓN MOBILE — Para clientes:** *(conservar del documento base sin cambios)*
5. **SECCIÓN ADMIN — Para administradores:** *(nueva sección a crear)*
   - Acceso al panel de administración (URL y login con Clerk)
   - Dashboard: métricas generales del negocio
   - Gestión de productos: agregar, editar, eliminar, subir imágenes
   - Gestión de clientes: ver lista, activar y desactivar cuentas
   - Gestión de pedidos: ver lista completa, cambiar estados del pedido, emails automáticos al cliente
   - Gestión de cupones: crear, editar, activar/desactivar, eliminar
6. Preguntas frecuentes (organizadas por tipo de usuario: cliente web/mobile y administrador)

---

### Documento 2 — Manual Técnico

**Estado:** Crear desde cero
**Alcance:** Arquitectura completa — Web + Mobile + Admin + Backend
**Resultado esperado:** Documento Word (.docx) en español formal/técnico

#### Archivos que debes pedirle a Jair:
1. Estructura de carpetas de `ecommerce_app/mobile` *(ver insumos comunes)*
2. Estructura de carpetas de `ecommerce_app/admin` *(ver insumos comunes)*
3. Estructura de carpetas de `ecommerce_app/backend` *(ver insumos comunes)*
4. `contexto-don-palito-jr.md` — en `web/docs/` — contexto detallado del proyecto *(opcional)*
5. `CHANGELOG.md` — en `web/docs/` — historial de cambios *(opcional)*
6. `ARRANCAR-PROYECTO.md` — en `web/docs/` — guía de inicio *(opcional)*
7. `cambio-backend-productos-publicos.md` — en `web/docs/` *(opcional)*

> Con la Sección 1 de esta guía y los insumos comunes tienes suficiente para arrancar.

#### Instrucciones:
Con base en la Sección 1 de esta guía, redacta el manual técnico completo. Sé preciso con versiones, rutas y configuraciones. Documenta los 4 componentes del sistema.

#### Secciones mínimas requeridas:
1. Introducción y propósito del documento
2. Descripción general del sistema (3 clientes + 1 backend compartido)
3. Diagrama de arquitectura (ASCII art o descripción textual con los 4 componentes + servicios externos)
4. Stack tecnológico con versiones exactas — separado por capa:
   - Frontend Web (React + Vite + Tailwind + DaisyUI + React Query + Clerk + Stripe)
   - Backend compartido (Node.js + Express 5 + MongoDB + Mongoose + Clerk + Inngest + Cloudinary + Stripe + Nodemailer + PDFKit)
   - Mobile (React Native + Expo)
   - Admin Panel (React)
5. Estructura de carpetas de los 4 componentes (web, backend, mobile, admin)
6. Modelos de datos — esquemas MongoDB con todos los campos (extraer de Sección 1.7)
7. API REST — documentación de todos los endpoints (extraer de Sección 1.9); nota que web, mobile y admin consumen los mismos endpoints del backend compartido
8. Flujos de negocio principales (extraer de Sección 1.10):
   - Autenticación con Clerk (web + mobile usan el mismo Clerk)
   - Compra con Stripe (flujo web)
   - Compra por transferencia bancaria (flujo web)
   - Flujo del admin al gestionar un pedido (cambio de estado + email automático)
   - Ciclo de vida completo de un pedido
9. Sistema de autenticación y autorización (Clerk + roles admin/cliente, compartido entre plataformas)
10. Sistema de pagos (Stripe + Transferencia)
11. Sistema de emails y facturas (Nodemailer + PDFKit)
12. Servicios externos y su rol (MongoDB Atlas, Clerk, Cloudinary, Stripe, Inngest, ngrok en dev)
13. Variables de entorno requeridas por componente (.env del web, .env del backend)
14. Guía de instalación y arranque local (extraer de Sección 1.14)
15. Dependencias y versiones por componente (extraer de Sección 1.4)
16. Convenciones de código y estructura del proyecto

---

### Documento 3 — Informe de QA (Aseguramiento de Calidad)

**Estado:** Crear desde cero
**Alcance:** Pruebas de todos los clientes — Web + Mobile + Admin
**Resultado esperado:** Documento Word (.docx) en español formal

#### Archivos que debes pedirle a Jair:
1. Estructura de carpetas de `ecommerce_app/mobile` *(ver insumos comunes)*
2. Estructura de carpetas de `ecommerce_app/admin` *(ver insumos comunes)*
3. Estructura de carpetas de `ecommerce_app/backend` *(ver insumos comunes)*
4. `CHANGELOG.md` — en `web/docs/` — contiene bugs encontrados y resueltos por sesión *(opcional)*

> Con las Secciones 2 (RF) y 3 (RNF) de esta guía tienes la base para los casos de prueba. El CHANGELOG es complementario para el registro de bugs.

#### Instrucciones:
Crea un informe de QA profesional que cubra las pruebas funcionales, de usabilidad, compatibilidad y rendimiento del sistema completo. Los RF son compartidos entre plataformas; diferencia en cuál plataforma se ejecuta cada prueba.

#### Secciones mínimas requeridas:
1. Introducción y objetivo del informe
2. Alcance de las pruebas (qué se probó: web, mobile, admin; qué quedó fuera del alcance)
3. Tipos de pruebas realizadas:
   - Pruebas funcionales (basadas en RF, ejecutadas en las 3 plataformas)
   - Pruebas de usabilidad (web, mobile y admin panel)
   - Pruebas de compatibilidad: web (Chrome, Firefox, Safari, Edge) + mobile (iOS / Android)
   - Pruebas de responsividad: web (mobile/tablet/desktop) + tamaños de pantalla mobile
   - Pruebas de rendimiento
4. Casos de prueba por RF — tabla por plataforma con columnas:
   `ID | RF asociado | Plataforma (Web/Mobile/Admin) | Descripción | Precondiciones | Pasos | Resultado esperado | Resultado obtenido | Estado (PASS/FAIL)`
   - Cubrir los 51 RF indicando en qué plataforma(s) aplica cada uno
5. Pruebas de RNF — tabla similar para los 20 RNF
6. Registro de bugs encontrados y resueltos (extraer del CHANGELOG si Jair lo adjunta)
7. Bugs conocidos / pendientes
8. Métricas de calidad (% de casos PASS y FAIL por plataforma)
9. Conclusiones y recomendaciones

---

### Documento 4 — Informe de Despliegue

**Estado:** Crear desde cero
**Alcance:** Despliegue de todos los componentes — Web + Mobile + Admin + Backend
**Resultado esperado:** Documento Word (.docx) en español formal/técnico

#### Archivos que debes pedirle a Jair:
1. Estructura de carpetas de `ecommerce_app/mobile` *(ver insumos comunes)*
2. Estructura de carpetas de `ecommerce_app/admin` *(ver insumos comunes)*
3. Estructura de carpetas de `ecommerce_app/backend` *(ver insumos comunes)*
4. `ARRANCAR-PROYECTO.md` — en `web/docs/` — guía de inicio del web y backend *(opcional)*
5. `cambio-backend-productos-publicos.md` — en `web/docs/` *(opcional)*

> Con las Secciones 1.13 y 1.14 de esta guía y los insumos comunes tienes lo esencial.

#### Instrucciones:
Documenta el proceso de despliegue de todos los componentes del sistema: web, mobile, admin y backend.

#### Secciones mínimas requeridas:
1. Introducción y propósito del documento
2. Entornos del sistema (desarrollo local, staging, producción)
3. Servicios externos y su configuración (compartidos entre plataformas):
   - MongoDB Atlas (base de datos en la nube)
   - Clerk (autenticación — dashboard, webhooks, configuración por plataforma)
   - Cloudinary (almacenamiento de imágenes)
   - Stripe (pagos — keys de prueba vs. producción)
   - Inngest (background jobs)
   - ngrok (túnel para webhooks en desarrollo)
4. **Despliegue del Backend** (compartido por web, mobile y admin):
   - Instalación de dependencias (`npm install`)
   - Configuración del `.env` con todas las variables requeridas
   - Arranque en desarrollo (`npm run dev:all`)
   - Configuración del webhook de Clerk en el dashboard
   - Consideraciones para producción (hosting en Railway, Render o similar)
5. **Despliegue del Frontend Web:**
   - Instalación y configuración del `.env`
   - Build de producción (`npm run build`)
   - Hosting (Vercel, Netlify o similar)
6. **Despliegue del Admin Panel:**
   - Instalación y configuración
   - Build y hosting (proceso similar al web)
7. **Publicación de la App Mobile (Expo):**
   - Instalación de Expo CLI / EAS CLI
   - Configuración del `app.json` / `eas.json`
   - Build para Android (`eas build --platform android`)
   - Build para iOS (`eas build --platform ios`)
   - Publicación en Google Play Store / App Store (pasos generales)
8. Configuración del Stripe CLI para pruebas locales de webhook
9. Verificación del despliegue (tabla de smoke testing por componente)
10. Troubleshooting — problemas comunes y soluciones
11. Consideraciones de seguridad para producción

---

### Documento 5 — Informe de Especificación de Requerimientos (ERS)

**Estado:** Actualizar base existente
**Alcance:** Requisitos y diagramas del sistema completo — Web + Mobile + Admin + Backend
**Resultado esperado:** Documento Word (.docx) con diagramas UML en español formal

#### Archivos que debes pedirle a Jair (en este orden):
1. `5. Informe Especificación de Requerimientos 21022025.docx` — en `D:\1_donpalitojr\Insumos Documentación Proyecto 2026\` — **documento base a actualizar**
2. `ERS_Don_Palito_Junior_2026_Parte_1.docx` — misma carpeta
3. `ERS_Don_Palito_Junior_2026_Parte_2_Requisitos_Funcionales.docx` — misma carpeta
4. `ERS_Don_Palito_Junior_2026_Parte_3_Requisitos_No_Funcionales.docx` — misma carpeta
5. `ERS_Don_Palito_Junior_2026_Parte_4_Arquitectura_y_Reglas.docx` — misma carpeta
6. `REQUISITOS FUNCIONALES.txt` y `REQUISITOS NO FUNCIONALES.txt` — en `web/docs/`
7. Estructura de carpetas de `ecommerce_app/mobile` *(ver insumos comunes)*
8. Estructura de carpetas de `ecommerce_app/admin` *(ver insumos comunes)*
9. Estructura de carpetas de `ecommerce_app/backend` *(ver insumos comunes)*

#### Instrucciones:
1. Pide primero el documento base (`5. Informe...`) y léelo para determinar qué está desactualizado.
2. Luego pide las 4 partes ERS 2026 para complementar.
3. Actualiza con la información actual del proyecto (Secciones 1–3 de esta guía).
4. Los diagramas UML genéralos en **código PlantUML** para que Jair los renderice en plantuml.com.

#### Diagramas requeridos:
Trabaja los diagramas de a uno (un RF a la vez o por grupo temático). Todos los diagramas deben reflejar los **3 actores principales del sistema**: Cliente Web, Cliente Mobile y Administrador.

**A. Modelo de Caso de Uso** — para TODOS los RF (51)
- Actores: **Cliente Web**, **Cliente Mobile**, **Administrador**, Sistema (Clerk, Stripe, Backend)
- Indicar en qué plataforma(s) se ejecuta cada RF
- Relaciones include/extend donde aplique

**B. Diagrama de Caso de Uso** — para TODOS los RF (51)
- Mismo enfoque multi-actor
- Agrupar por módulo: Autenticación, Catálogo, Carrito, Checkout, Pedidos, Admin

**C. Historias de Usuario** — para TODOS los RF (51)
- Formato: *"Como [Cliente Web / Cliente Mobile / Administrador], quiero [acción], para [beneficio]"*
- Incluir criterios de aceptación por cada historia

**D. Diagrama de Actividades** — para TODOS los RF (51)
- Mostrar el flujo de actividades del actor al interactuar con el sistema, diferenciando plataforma cuando sea relevante

**E. Diagrama de Estados** — solo RF con estados en el sistema:
- **Pedido:** pending → paid → in_preparation → ready → delivered (bifurcaciones: canceled, rejected) — estado compartido entre web, mobile y admin
- **Cuenta de usuario:** activa → inactiva → reactivada (desactivada por el propio cliente o por el admin)
- **Cupón:** activo → usado → expirado → inactivo (isActive: false)

**F. Diagrama de Secuencias** — solo RF con secuencias relevantes:
- RF-01/02 (Web): Registro e inicio de sesión — Clerk → Webhook → Inngest → MongoDB
- RF-01/02 (Mobile): Autenticación SSO con Clerk en app mobile
- RF-15/16 (Web): Checkout con Stripe — Cliente → Frontend → Backend → Stripe → Webhook → MongoDB
- RF-15/16 (Web): Checkout por transferencia — Cliente → Frontend → Backend → MongoDB
- RF-17: Validación de cupón — Cliente → Frontend → Backend → MongoDB
- RF-19: Generación y envío de factura — Admin cambia estado → Backend → PDFKit → Nodemailer → Cliente
- RF-22: Calificación de producto — Cliente → Frontend → Backend → MongoDB
- RF-41/42 (Admin): Cambio de estado de pedido — Administrador → Admin Panel → Backend → Email automático → Cliente

---

### Documento 6 — Propuesta Técnica

**Estado:** Actualizar base existente
**Alcance:** Propuesta del sistema completo — Web + Mobile + Admin + Backend
**Resultado esperado:** Documento Word (.docx) en español formal

#### Archivos que debes pedirle a Jair:
1. `6. Propuesta Técnica Don Palito Jr.docx` — en `D:\1_donpalitojr\Insumos Documentación Proyecto 2026\` — **documento base**
2. `PROPUESTA TÉCNICA DON PALITO Jr..txt` — misma carpeta — versión texto de apoyo
3. Estructura de carpetas de `ecommerce_app/mobile` *(ver insumos comunes)*
4. Estructura de carpetas de `ecommerce_app/admin` *(ver insumos comunes)*
5. Estructura de carpetas de `ecommerce_app/backend` *(ver insumos comunes)*

#### Instrucciones:
1. Pide el .docx base y el .txt de apoyo. Léelos y determina qué está desactualizado.
2. Actualiza con la información actual de esta guía.
3. La propuesta debe describir los 4 componentes del sistema como una solución integral.

#### Secciones mínimas requeridas:
1. Presentación del equipo (Jair — Web, Andrea — Backend/Mobile, Maicol — Mobile/Admin)
2. Descripción del cliente y el negocio (Cafetería Don Palito Jr., Sabaneta)
3. Problemática identificada (por qué necesita el sistema)
4. Solución propuesta — descripción de la solución integral:
   - Tienda web para clientes (React)
   - App mobile para clientes (React Native/Expo)
   - Panel de administración (React)
   - Backend compartido (Node.js + Express + MongoDB)
5. Alcance detallado por componente:
   - Frontend Web: páginas implementadas, funcionalidades
   - Backend: API REST, modelos, servicios (emails, facturas, pagos)
   - App Mobile: pantallas, funcionalidades
   - Admin Panel: páginas, gestión de recursos
6. Stack tecnológico completo actualizado con versiones (extraer de Sección 1.4)
7. Arquitectura del sistema (diagrama con los 3 clientes + backend + servicios externos: Clerk, MongoDB Atlas, Cloudinary, Stripe, Inngest)
8. Roles del equipo en cada componente
9. Metodología de desarrollo
10. Cronograma de desarrollo (sprints o hitos)
11. Presupuesto estimado ($8.000.000 COP)
12. Riesgos identificados y plan de mitigación
13. Conclusiones

---

## SECCIÓN 5 — DOCUMENTOS ADICIONALES (no requieren construcción de Claude Chat)

### Código del Proyecto
- **Acción:** Descargar el repo completo desde GitHub como `.zip`
- **URL:** https://github.com/DarkerJB/donpalitojrweb.git → botón "Code" → "Download ZIP"
- **Excluir:** carpeta `node_modules` antes de comprimir si es necesario

### Repositorio en GitHub
- **Acción:** Crear un documento simple (Word o PDF) con el enlace al repositorio
- **Contenido mínimo:** URL del repo, nombre del proyecto, integrantes, fecha

---

## SECCIÓN 6 — HISTORIAL DE VERSIONES DEL DOCUMENTO

| Versión | Fecha | Cambio |
|---|---|---|
| 1.0 | 25-02-2026 | Creación inicial — contexto completo, 51 RF, 20 RNF, endpoints, flujos, instrucciones por documento |

---

*Generado por: Claude Code (claude.ai/claude-code)*
*Mantenido por: Jair González Buelvas — DarkerJB*
*Proyecto: Don Palito Jr. — Sistema E-commerce — SENA 2026*
