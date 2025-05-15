// src/auth/useAuth.ts
import React from 'react';
import { useAuthContext } from './AuthContext';

export const useAuth = () => {
  const { token } = useAuthContext();

  const isAuthenticated = React.useMemo(() => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }, [token]);

  return { isAuthenticated };
};
