import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

export const AuthProvider = ({ children }) => children;

export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { signOut, sessionClaims } = useClerkAuth();

  const isAdmin =
    sessionClaims?.role === 'admin' ||
    user?.publicMetadata?.role === 'admin' ||
    user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

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
    logout: () => signOut({ redirectUrl: '/' }),
    updateProfile: async () => {},
  };
};