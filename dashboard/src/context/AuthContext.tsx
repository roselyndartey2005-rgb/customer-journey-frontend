import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import api, { clearAuthToken } from '../lib/api';
import type { AuthenticationResponse, AuthenticationRequest, RegisterRequest } from '../types';

interface AuthContextType {
  user: AuthenticationResponse | null;
  isLoading: boolean;
  login: (data: AuthenticationRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (data: AuthenticationRequest) => {
    const response = await api.post<AuthenticationResponse>('/api/v1/auth/login', data);
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const response = await api.post<AuthenticationResponse>('/api/v1/auth/register', data);
    setUser(response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch {
      // ignore logout errors
    }
    setUser(null);
    localStorage.removeItem('user');
    clearAuthToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
