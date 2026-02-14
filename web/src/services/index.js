import api from './api';

// ============= PRODUCTOS =============
export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/product', { params });
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
  },

  searchProducts: async (query) => {
    const response = await api.post('/product/search', { query });
    return response.data;
  },
};

// ============= CARRITO =============
export const cartService = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  addToCart: async (productId, quantity) => {
    const response = await api.post('/cart/add', { productId, quantity });
    return response.data;
  },

  updateItem: async (itemId, quantity) => {
    const response = await api.put(`/cart/update/${itemId}`, { quantity });
    return response.data;
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`/cart/remove/${itemId}`);
    return response.data;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  applyCoupon: async (code) => {
    const response = await api.post('/cart/apply-coupon', { code });
    return response.data;
  },
};

// ============= ÓRDENES =============
export const orderService = {
  createOrder: async (orderData) => {
    const response = await api.post('/order/create', orderData);
    return response.data;
  },

  getOrderHistory: async (params = {}) => {
    const response = await api.get('/order/history', { params });
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/order/${id}`);
    return response.data;
  },
};

// ============= RESEÑAS =============
export const reviewService = {
  createReview: async (reviewData) => {
    const response = await api.post('/review', reviewData);
    return response.data;
  },

  getProductReviews: async (productId) => {
    const response = await api.get(`/review/product/${productId}`);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await api.put(`/review/${id}`, reviewData);
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/review/${id}`);
    return response.data;
  },
};
