import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Para cookies si el backend las usa
});

// Request interceptor - Agregar token a cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
          break;

        case 403:
          toast.error('No tienes permisos para realizar esta acción.');
          break;

        case 404:
          toast.error('Recurso no encontrado.');
          break;

        case 422:
          if (data.error && data.error.details) {
            Object.values(data.error.details).forEach((msg) => {
              toast.error(msg);
            });
          }
          break;

        case 429:
          toast.error('Demasiadas solicitudes. Por favor espera un momento.');
          break;

        case 500:
          toast.error('Error del servidor. Por favor intenta más tarde.');
          break;

        default:
          toast.error(
            data?.message || 
            data?.error?.message || 
            'Ocurrió un error. Por favor intenta nuevamente.'
          );
      }
    } else if (error.request) {
      toast.error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
    } else {
      toast.error('Error al procesar la solicitud.');
    }

    return Promise.reject(error);
  }
);

export default api;
