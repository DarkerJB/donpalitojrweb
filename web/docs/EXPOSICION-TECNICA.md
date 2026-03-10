# Exposición Técnica — Don Palito Jr. (Web Focus)

> Documento de referencia para el bloque técnico de la exposición final.
> Adjuntar a Claude Chat para construir pitch, guión y diapositivas.
> **Última actualización:** 3 de marzo de 2026

---

## 1. Candidato para el End-to-End: AGREGAR DIRECCIÓN

### ¿Por qué este formulario?
- CRUD **completo y visible** (crear, listar, editar, eliminar)
- **Validación en 3 capas**: teclado en tiempo real → Yup al enviar → backend
- Axios call limpio, sin dependencias externas (sin Stripe, sin Clerk complicado)
- Resultado visible inmediatamente en la UI (modal + lista de direcciones)
- Fácil provocar errores de validación en vivo frente al jurado

---

### 1.1 Frontend — AddressForm.jsx

**Archivo:** `web/src/components/profile/AddressForm.jsx`

#### Validación en tiempo real (keydown) — líneas 7-15
```js
// Impide que el usuario escriba números en el campo (nombre, ciudad)
const noNumbers = (e) => {
  if (/\d/.test(e.key)) e.preventDefault();
};

// Impide letras en el campo teléfono; permite navegación (Backspace, etc.)
const onlyNumbers = (e) => {
  if (!/[\d]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
};
```

#### Integración React Hook Form + Yup — línea 22-23
```js
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
  resolver: yupResolver(addressSchema),   // <-- validación con Yup
  defaultValues: address || { label: 'Casa', fullName: '', ... }
});
```

#### Campos con sus validaciones de teclado
| Campo | onKeyDown | maxLength | Línea JSX |
|---|---|---|---|
| `fullName` | `noNumbers` | — | 60 |
| `city` | `noNumbers` | — | 77 |
| `phoneNumber` | `onlyNumbers` | `10` | 85-86 |

#### Submit handler — `Profile.jsx` líneas 117-131
```js
const handleAddressSubmit = async (data) => {
  try {
    if (editingAddress) {
      await updateAddressAsync({ id: editingAddress._id, data });
      toast.success('Dirección actualizada');
    } else {
      await createAddressAsync(data);          // → POST /api/users/addresses
      toast.success('Dirección agregada');
    }
    setShowAddressModal(false);
    setEditingAddress(null);
  } catch {
    toast.error('Error al guardar la dirección');
  }
};
```

---

### 1.2 Hook — useAddresses.js

**Archivo:** `web/src/hooks/useAddresses.js`

```js
// GET — línea 16
const res = await api.get('/users/addresses');

// CREATE (POST) — línea 23
mutationFn: (data) => api.post('/users/addresses', data).then((r) => r.data),

// UPDATE (PUT) — línea 28
mutationFn: ({ id, data }) => api.put(`/users/addresses/${id}`, data).then((r) => r.data),

// DELETE — línea 33
mutationFn: (id) => api.delete(`/users/addresses/${id}`).then((r) => r.data),
```

Cada mutación llama `queryClient.invalidateQueries({ queryKey: ['addresses'] })` en `onSuccess` para refrescar la lista automáticamente.

---

### 1.3 Backend — Rutas

**Archivo:** `backend/src/routes/user.routes.js`

```js
router.use(protectRoute);                              // línea 7 — todas requieren token Clerk

router.post("/addresses", addAddress);                 // línea 9
router.get("/addresses", getAddresses);                // línea 10
router.put("/addresses/:addressId", updateAddress);    // línea 11
router.delete("/addresses/:addressId", deleteAddress); // línea 12
```

**Middleware protectRoute:** `backend/src/middleware/auth.middleware.js`
- Extrae el token del header `Authorization: Bearer {token}`
- Lo verifica con Clerk (`@clerk/express`)
- Carga el usuario de MongoDB y lo adjunta a `req.user`

---

### 1.4 Backend — Controlador

**Archivo:** `backend/src/controllers/user.controller.js`

| Función | Líneas | Qué hace |
|---|---|---|
| `addAddress` | 3-36 | Valida campos requeridos; si `isDefault=true` desmarca las demás; `user.addresses.push()` + `user.save()` |
| `getAddresses` | 38-47 | Devuelve `user.addresses` |
| `updateAddress` | 49-82 | Busca por `addressId`, actualiza campos con `||` (mantiene valor si no se envía), `user.save()` |
| `deleteAddress` | 84-97 | `user.addresses.pull(addressId)` + `user.save()` |

#### Lógica isDefault (addAddress / updateAddress)
```js
if (isDefault) {
  user.addresses.forEach((addr) => { addr.isDefault = false; }); // desmarca todas
}
user.addresses.push({ label, fullName, streetAddress, city, phoneNumber, isDefault: isDefault || false });
await user.save();
```

---

### 1.5 CRUD Completo — Dónde está cada operación

| Operación | Verbo HTTP | Endpoint | Controlador | Línea |
|---|---|---|---|---|
| **Create** | POST | `/api/users/addresses` | `addAddress` | 3 |
| **Read** | GET | `/api/users/addresses` | `getAddresses` | 38 |
| **Update** | PUT | `/api/users/addresses/:id` | `updateAddress` | 49 |
| **Delete** | DELETE | `/api/users/addresses/:id` | `deleteAddress` | 84 |

---

### 1.6 Fetch del formulario (línea exacta)

**Archivo:** `web/src/hooks/useAddresses.js`, **línea 23**
```js
mutationFn: (data) => api.post('/users/addresses', data).then((r) => r.data),
```

`api` es el cliente Axios configurado en `web/src/services/api.js` con el interceptor de Clerk que adjunta el token automáticamente.

---

### 1.7 CURL equivalentes

```bash
# 1. CREAR dirección
curl -X POST http://localhost:3000/api/users/addresses \
  -H "Authorization: Bearer {CLERK_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Casa",
    "fullName": "Jair González",
    "streetAddress": "Cra 47 76D Sur-37",
    "city": "Sabaneta",
    "phoneNumber": "3001234567",
    "isDefault": true
  }'

# 2. LISTAR direcciones
curl -X GET http://localhost:3000/api/users/addresses \
  -H "Authorization: Bearer {CLERK_TOKEN}"

# 3. EDITAR dirección
curl -X PUT http://localhost:3000/api/users/addresses/{ADDRESS_ID} \
  -H "Authorization: Bearer {CLERK_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"label": "Trabajo", "city": "Medellín", "isDefault": false}'

# 4. ELIMINAR dirección
curl -X DELETE http://localhost:3000/api/users/addresses/{ADDRESS_ID} \
  -H "Authorization: Bearer {CLERK_TOKEN}"
```

> Para obtener el `CLERK_TOKEN` en desarrollo: en el navegador con sesión activa, abre la consola y ejecuta `(await window.Clerk.session.getToken())`.

---

## 2. Expresiones Regulares y Validaciones

### Archivo central

**`web/src/utils/validationSchemas.js`**

#### Regex reutilizables definidas al inicio del archivo

```js
// Línea 4
const SOLO_LETRAS = /^[a-zA-ZÀ-ÿ\s]+$/;
// → Acepta letras (mayúsculas y minúsculas), letras con tilde/ñ, y espacios
// → Rechaza: números, @, #, -, _, etc.

// Línea 5
const TELEFONO_CO = /^3\d{9}$/;
// → Debe empezar por 3, seguido de exactamente 9 dígitos (total: 10 dígitos)
// → Rechaza: letras, números que no empiecen por 3, teléfonos de 9 u 11 dígitos
```

### Tabla completa de validaciones por campo

| Campo | Regex / Regla Yup | Mensaje de error | Archivo: línea |
|---|---|---|---|
| **Nombre** | `SOLO_LETRAS` + min 3 | "Solo puede contener letras" | validationSchemas.js:24 |
| **Email** | `.email()` (built-in Yup) | "Ingresa un email válido" | validationSchemas.js:13 |
| **Contraseña** | min 8 + `/[A-Z]/` + `/[a-z]/` + `/\d/` | "Al menos una mayúscula/minúscula/número" | validationSchemas.js:33-35 |
| **Confirmar contraseña** | `.oneOf([yup.ref('password')])` | "Las contraseñas no coinciden" | validationSchemas.js:39 |
| **Términos** | `.oneOf([true])` | "Debes aceptar los términos" | validationSchemas.js:42 |
| **Teléfono** | `TELEFONO_CO` + nullable | "10 dígitos, empieza por 3" | validationSchemas.js:80 |
| **Tipo de dirección** | `.required()` | "Selecciona un tipo de dirección" | validationSchemas.js:88 |
| **Nombre completo** | `SOLO_LETRAS` | "Solo puede contener letras" | validationSchemas.js:92 |
| **Ciudad** | `SOLO_LETRAS` | "Solo puede contener letras" | validationSchemas.js:99 |
| **Teléfono (dirección)** | `TELEFONO_CO` + required | "10 dígitos, empieza por 3" | validationSchemas.js:103 |
| **Mensaje (contacto)** | min 10 chars | "Al menos 10 caracteres" | validationSchemas.js:133 |

### Validación en tiempo real (keydown) — AddressForm.jsx

```js
// Línea 7-9: Bloquea dígitos en campos de texto (nombre, ciudad)
const noNumbers = (e) => {
  if (/\d/.test(e.key)) e.preventDefault();
};

// Línea 11-15: Bloquea letras en campos numéricos (teléfono, documento)
const onlyNumbers = (e) => {
  if (!/[\d]/.test(e.key) && !['Backspace','Delete','Tab','ArrowLeft','ArrowRight'].includes(e.key))
    e.preventDefault();
};
```

### Cómo demostrarlo en vivo

1. Abrir Perfil → pestaña Direcciones → "Agregar dirección"
2. En "Nombre completo": intentar escribir `123` → no escribe nada
3. En "Teléfono": intentar escribir `abc` → no escribe nada
4. Intentar escribir 11 dígitos → se corta en 10 (`maxLength={10}`)
5. Enviar con nombre de 1 letra → muestra "Al menos 3 caracteres"
6. Ingresar teléfono que no empiece por 3 → muestra "10 dígitos, empieza por 3"

---

## 3. Aspecto Diferenciador del Backend: Inngest + Nodemailer

### 3.1 ¿Qué hace Inngest?

Inngest es un orquestador de background jobs. En lugar de ejecutar acciones secundarias (como enviar emails) directamente en el endpoint (lo que bloquearía la respuesta y podría fallar sin reintento), Inngest las ejecuta de forma asíncrona con retry automático.

**Sin Inngest (enfoque común):**
```
POST /register → guardar usuario → enviar email → responder 201
(si el email falla, el usuario ya fue guardado pero la respuesta falla)
```

**Con Inngest (enfoque del proyecto):**
```
Clerk registra el usuario → dispara webhook → Inngest ejecuta syncUser → responde 200
                                    (Inngest reintenta si algo falla)
```

---

### 3.2 Flujo completo de registro de usuario

**Archivo:** `backend/src/config/inngest.js`

```
[Usuario hace clic en "Registrarse" / inicia sesión con Google en Clerk]
         ↓
[Clerk crea el usuario en su sistema y dispara:]
  webhook → POST /api/auth/inngest  (firmado con CLERK_WEBHOOK_SECRET)
         ↓
[Inngest recibe evento "clerk.user.created"]
         ↓
[Función syncUser ejecuta (líneas 10-35):]
  1. await connectDB()                          — línea 17
  2. Extrae: id, email_addresses, first_name,
             last_name, image_url del evento    — línea 18
  3. Construye newUser:                         — líneas 19-26
     { clerkId, email, name, imageUrl, address: [], wishlist: [] }
  4. await User.create(newUser)                 — línea 27
  5. sendWelcomeEmail({ userName, userEmail })  — líneas 30-33
     (no bloquea: .catch() registra el error sin romper el flujo)
         ↓
[Nodemailer (email.service.js) envía:]
  - Email al cliente: bienvenida con nombre
  - Email al admin: notificación de nuevo registro
```

**Código exacto de syncUser:**
```js
// inngest.js líneas 10-35
const syncUser = inngest.createFunction(
  { id: "sync-user" },
  { event: "clerk.user.created" },    // ← trigger: webhook de Clerk
  async ({ event }) => {
    await connectDB();
    const { id, email_addresses, first_name, last_name, image_url } = event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0]?.email_address,
      name: `${first_name || ""} ${last_name || ""}` || "Usuario",
      imageUrl: image_url,
      address: [],
      wishlist: [],
    };
    await User.create(newUser);

    sendWelcomeEmail({
      userName: `${first_name || ""} ${last_name || ""}`.trim() || "Usuario",
      userEmail: email_addresses[0]?.email_address,
    }).catch(err => console.error("Error enviando welcome email:", err.message));
  }
);
```

**Segunda función — eliminación de usuario:**
```js
// inngest.js líneas 37-50
const deleteUserFromDB = inngest.createFunction(
  { id: "delete-user-from-db" },
  { event: "clerk.user.deleted" },    // ← trigger: usuario eliminado en Clerk
  async ({ event }) => {
    await connectDB();
    const { id } = event.data;
    await User.deleteOne({ clerkId: id });
  }
);
```

---

### 3.3 Sistema completo de emails (7 funciones)

**Archivo:** `backend/src/services/email.service.js`

| Función | Cuándo se dispara | Enviado a |
|---|---|---|
| `sendWelcomeEmail` | Registro (Inngest `syncUser`) | Cliente + Admin |
| `sendOrderCreatedClientEmail` | Pago exitoso (Stripe webhook o transferencia) | Cliente |
| `sendOrderCreatedAdminEmail` | Misma acción | Admin |
| `sendOrderUpdatedClientEmail` | Admin cambia estado del pedido | Cliente |
| `sendOrderUpdatedAdminEmail` | Misma acción | Admin |
| `sendInvoiceEmails` | Estado → `"paid"` | Cliente + Admin (con PDF adjunto) |
| `sendMarketingSubscriptionEmail` | Usuario activa "emails de marketing" | Cliente + Admin |

El email se configura con **Nodemailer + Gmail App Password:**
```js
// email.service.js líneas 4-12
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.ADMIN_EMAIL,
    pass: ENV.EMAIL_PASSWORD,   // contraseña de aplicación Gmail, no la contraseña normal
  },
});
```

---

### 3.4 Flujo Stripe Webhook (pago con tarjeta)

**Archivo:** `backend/src/controllers/payment.controller.js`, función `handleWebhook`

```
[Cliente ingresa tarjeta en StripeCheckoutForm]
         ↓
[Stripe procesa el pago y envía:]
  POST /api/payments/webhook  (firmado con STRIPE_WEBHOOK_SECRET)
         ↓
[handleWebhook() verifica la firma:]
  stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)
         ↓
[Si evento = "payment_intent.succeeded":]
  1. Verificar idempotencia: ¿ya existe una Order con este paymentIntent.id?
  2. Extraer metadata: userId, orderItems (JSON), shippingAddress, couponCode, totalPrice
  3. Enriquecer items: buscar nombre actual de cada producto en MongoDB
  4. Order.create({ user, orderItems, shippingAddress, paymentResult, totalPrice, status: "pending" })
  5. Decrementar stock:
     Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
  6. Marcar cupón como usado:
     Coupon.updateOne({ code }, { $addToSet: { usedBy: userId } })
  7. Enviar emails (no bloquea):
     Promise.allSettled([sendOrderCreatedAdminEmail(), sendOrderCreatedClientEmail()])
  8. Responder { received: true }  ← Stripe necesita 200 para no reintentar
```

**Por qué `Promise.allSettled` y no `Promise.all`:**
Si un email falla, `Promise.all` fallaría toda la función y Stripe reintentaría el webhook (creando ordenes duplicadas). `Promise.allSettled` permite que uno falle sin afectar al otro.

---

## 4. Arquitectura General del Backend

### 4.1 Todos los endpoints por módulo

**Total: 47 endpoints** (8 públicos sin auth, 39 protegidos)

#### Productos — `product.routes.js` (2 rutas, **públicas**)
| Método | Ruta | Controlador |
|---|---|---|
| GET | `/api/products` | `getAllProducts` |
| GET | `/api/products/:id` | `getProductById` |

#### Usuarios — `user.routes.js` (11 rutas, protegidas)
| Método | Ruta | Controlador |
|---|---|---|
| POST | `/api/users/addresses` | `addAddress` |
| GET | `/api/users/addresses` | `getAddresses` |
| PUT | `/api/users/addresses/:addressId` | `updateAddress` |
| DELETE | `/api/users/addresses/:addressId` | `deleteAddress` |
| POST | `/api/users/wishlist` | `addToWishlist` |
| GET | `/api/users/wishlist` | `getWishlist` |
| DELETE | `/api/users/wishlist/:productId` | `removeFromWishlist` |
| GET | `/api/users/profile` | `getProfile` |
| PUT | `/api/users/profile` | `updateProfile` |
| PUT | `/api/users/notification-preferences` | `updateNotificationPreferences` |
| PATCH | `/api/users/deactivate` | `deactivateAccount` |

#### Carrito — `cart.routes.js` (5 rutas, protegidas)
| Método | Ruta | Controlador |
|---|---|---|
| GET | `/api/cart` | `getCart` |
| POST | `/api/cart` | `addToCart` |
| PUT | `/api/cart/:productId` | `updateCartItem` |
| DELETE | `/api/cart/:productId` | `removeFromCart` |
| DELETE | `/api/cart` | `clearCart` |

#### Pedidos — `order.routes.js` (3 rutas)
| Método | Ruta | Controlador |
|---|---|---|
| POST | `/api/orders` | `createOrder` |
| GET | `/api/orders` | `getUserOrders` |
| GET | `/api/orders/:orderId/invoice` | `downloadInvoice` |

#### Pagos — `payment.routes.js` (3 rutas)
| Método | Ruta | Auth | Controlador |
|---|---|---|---|
| POST | `/api/payments/create-intent` | Protegida | `createPaymentIntent` |
| POST | `/api/payments/create-transfer-order` | Protegida | `createTransferOrder` |
| POST | `/api/payments/webhook` | **Pública** (Stripe firma) | `handleWebhook` |

#### Cupones — `coupon.routes.js` (6 rutas)
| Método | Ruta | Auth | Controlador |
|---|---|---|---|
| GET | `/api/coupons/active` | **Pública** | `getActiveCoupons` |
| POST | `/api/coupons/validate` | Protegida | `validateCoupon` |
| GET | `/api/coupons` | Admin only | `getCoupons` |
| POST | `/api/coupons` | Admin only | `createCoupon` |
| PATCH | `/api/coupons/:id` | Admin only | `updateCoupon` |
| DELETE | `/api/coupons/:id` | Admin only | `deleteCoupon` |

#### Reseñas — `review.routes.js` (2 rutas, protegidas)
| Método | Ruta | Controlador |
|---|---|---|
| POST | `/api/reviews` | `createReview` |
| DELETE | `/api/reviews/:reviewId` | `deleteReview` |

#### Admin — `admin.routes.js` (9 rutas, admin only)
| Método | Ruta | Controlador |
|---|---|---|
| POST | `/api/admin/products` | `createProduct` |
| GET | `/api/admin/products` | `getAllProducts` |
| PUT | `/api/admin/products/:id` | `updateProduct` |
| DELETE | `/api/admin/products/:id` | `deleteProduct` |
| GET | `/api/admin/orders` | `getAllOrders` |
| PATCH | `/api/admin/orders/:orderId/status` | `updateOrderStatus` |
| GET | `/api/admin/customers` | `getAllCustomers` |
| PATCH | `/api/admin/customers/:customerId/status` | `updateCustomerStatus` |
| GET | `/api/admin/stats` | `getDashboardStats` |

---

### 4.2 Variables de entorno (23 variables)

**Archivo:** `backend/src/config/env.js`

```
NODE_ENV              PORT               DB_URL

# Clerk
CLERK_PUBLISHABLE_KEY    CLERK_SECRET_KEY    CLERK_WEBHOOK_SECRET

# Inngest
INNGEST_SIGNING_KEY

# Cloudinary
CLOUDINARY_API_KEY    CLOUDINARY_API_SECRET    CLOUDINARY_CLOUD_NAME

# Email / Factura
ADMIN_EMAIL    EMAIL_PASSWORD    APP_NAME    LOGO_URL
COMPANY_NAME   COMPANY_NIT       COMPANY_ADDRESS
COMPANY_CITY   COMPANY_PHONE

# URLs
CLIENT_URL

# Stripe
STRIPE_SECRET_KEY    STRIPE_PUBLISHABLE_KEY    STRIPE_WEBHOOK_SECRET
```

---

### 4.3 Servicios externos — cómo se inicializan

| Servicio | Archivo | Cómo |
|---|---|---|
| **MongoDB** | `src/config/db.js` | `mongoose.connect(ENV.DB_URL)` — llamado como `connectDB()` |
| **Inngest** | `src/config/inngest.js` | `new Inngest({ id: "ecommerce-app" })` |
| **Clerk** | `src/middleware/auth.middleware.js` | `@clerk/express` verifica JWT en cada request |
| **Cloudinary** | `src/config/cloudinary.js` | `cloudinary.config({ cloud_name, api_key, api_secret })` |
| **Stripe** | `src/controllers/payment.controller.js` | `new Stripe(ENV.STRIPE_SECRET_KEY)` — línea 9 |
| **Nodemailer** | `src/services/email.service.js` | `nodemailer.createTransport({ service: "gmail", auth: {...} })` |

---

## 5. Diagrama de Flujo del Sistema (para exposición)

```
CLIENTE (Web / Mobile)
       │
       │ HTTPS + Bearer Token (Clerk JWT)
       ▼
BACKEND (Express 5 — puerto 3000)
       │
       ├── protectRoute ──── Clerk (@clerk/express) verifica token
       │
       ├── /api/products   ──────────────────────── MongoDB (productos)
       ├── /api/cart       ──────────────────────── MongoDB (carrito)
       ├── /api/users/*    ──────────────────────── MongoDB (usuarios)
       ├── /api/orders     ──────────────────────── MongoDB (pedidos)
       ├── /api/coupons/*  ──────────────────────── MongoDB (cupones)
       ├── /api/reviews    ──────────────────────── MongoDB (reseñas)
       │
       ├── /api/payments/create-intent ──────────── Stripe API
       ├── /api/payments/webhook ◄──────────────── Stripe (evento de pago)
       │         └── Order.create + email
       │
       ├── /api/auth/inngest ◄───────────────────── Clerk (webhook registro)
       │         └── Inngest: syncUser → User.create + sendWelcomeEmail
       │
       └── /api/admin/* ───── adminOnly ─────────── MongoDB (admin ops)
                                                 └── Cloudinary (imágenes)

EMAIL (Nodemailer/Gmail): registro, pedidos, facturas PDF+CSV
```

---

## 6. Guía para el Demo en Vivo (Web — 5 minutos)

### Orden sugerido de pantallas

1. **Home** — mostrar carrusel de cupones (llamada pública `/api/coupons/active`) y banner
2. **Catálogo** — filtrar por categoría (llamada pública `/api/products`)
3. **Detalle de producto** — mostrar ratings, botón wishlist
4. **Carrito** — agregar producto, modificar cantidad, aplicar cupón
5. **Checkout** — seleccionar dirección → pago por transferencia (más fácil en demo) → éxito
6. **Perfil** → **Direcciones** — CRUD completo (crear, editar, eliminar) = **PUNTO FUERTE TÉCNICO**
7. **Mis Pedidos** — ver historial, calificar pedido entregado

### Flujo de preguntas técnicas — respuestas rápidas

| Pregunta del jurado | Respuesta |
|---|---|
| "¿Dónde está el fetch?" | `web/src/hooks/useAddresses.js` línea 23 |
| "¿Dónde está el CURL?" | Este documento, Sección 1.7 |
| "¿Dónde está el CRUD?" | `backend/src/controllers/user.controller.js` líneas 3, 38, 49, 84 |
| "¿Dónde están las regex?" | `web/src/utils/validationSchemas.js` líneas 4-5 |
| "¿Dónde están las validaciones en tiempo real?" | `web/src/components/profile/AddressForm.jsx` líneas 7-15 |
| "¿Qué es lo diferenciador del backend?" | Inngest + Nodemailer — `backend/src/config/inngest.js` |
| "¿Dónde está el controlador de la función elegida?" | `backend/src/controllers/user.controller.js` |
| "¿Cómo funciona la autenticación?" | Clerk maneja todo; backend verifica JWT en `auth.middleware.js` |
