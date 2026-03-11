import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import api from '../services/api';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@donpalitojr.com';

export const AuthProvider = ({ children }) => children;

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut, sessionClaims } = useClerkAuth();
  const [accountStatus, setAccountStatus] = useState(null);

  const isAdmin =
    sessionClaims?.role === 'admin' ||
    user?.publicMetadata?.role === 'admin' ||
    user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    if (isLoaded && user) {
      api.get('/api/users/profile')
        .then(() => setAccountStatus('active'))
        .catch((err) => {
          if (err.response?.data?.code === 'ACCOUNT_INACTIVE') {
            setAccountStatus('inactive');
            signOut({ redirectUrl: '/cuenta-inactiva' });
          }
        });
    } else if (isLoaded && !user) {
      setAccountStatus(null);
    }
  }, [isLoaded, user]);

  return {
    user: user
      ? {
          name: user.fullName || user.firstName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          imageUrl: user.imageUrl || '',
          id: user.id,
          role: isAdmin ? 'admin' : 'user',
        }
      : null,
    loading: !isLoaded,
    isAuthenticated: !!user,
    isAdmin,
    accountStatus,
    logout: () => signOut({ redirectUrl: '/' }),
    updateProfile: async () => {},
  };
};