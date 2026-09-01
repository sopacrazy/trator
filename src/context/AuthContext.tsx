import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, setToken, clearToken, getToken } from '../lib/api';

interface AuthUser {
  id: string;
  username: string;
  name: string;
}

interface AuthContextData {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    api.get<AuthUser>('/auth/me')
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const { token, user } = await api.post<{ token: string; user: AuthUser }>('/auth/login', { username, password });
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
