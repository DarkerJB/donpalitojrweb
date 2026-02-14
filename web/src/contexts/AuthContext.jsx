import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario al iniciar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getProfile();
          setUser(response.data || response.user);
        } catch (error) {
          console.error('Error loading user:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const userData = response.data || response.user;
      const token = response.data?.token || response.token;
      
      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(userData);
      toast.success('¡Bienvenido!');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Credenciales incorrectas');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const newUser = response.data || response.user;
      const token = response.data?.token || response.token;
      
      if (token) {
        localStorage.setItem('token', token);
      }
      setUser(newUser);
      toast.success('¡Registro exitoso!');
      return true;
    } catch (error) {
      console.error('Register error:', error);
      toast.error(error.response?.data?.message || 'Error en el registro');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.info('Sesión cerrada');
  };

  const updateProfile = async (data) => {
    try {
      const response = await authService.updateProfile(data);
      setUser(response.data || response.user);
      toast.success('Perfil actualizado');
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Error al actualizar perfil');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
