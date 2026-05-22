import { createContext, useContext, useEffect, useState } from 'react';

import { authApi, api } from './api';
import { clearTokens, getAccessToken, setTokens } from './tokenService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (getAccessToken()) {
      loadProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function loadProfile() {
    try {
      const response = await api.get('/auth/profile/');
      setUser(response.data);
      return response.data;
    } catch (error) {
      clearTokens();
      setUser(null);
      throw error;
    }
  }

  async function login(credentials) {
    const response = await authApi.post('/login/', credentials);
    setTokens(response.data.access, response.data.refresh);
    await loadProfile();
  }

  async function register(payload) {
    await authApi.post('/register/', payload);
    await login({ username: payload.username, password: payload.password });
  }

  async function updateProfile(payload) {
    const response = await api.patch('/auth/profile/', payload);
    setUser(response.data);
    return response.data;
  }

  function logout() {
    clearTokens();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        register,
        updateProfile,
        refreshProfile: loadProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
