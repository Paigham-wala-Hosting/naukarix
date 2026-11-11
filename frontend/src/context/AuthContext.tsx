'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, api } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (payload: any) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginAsCandidate: () => Promise<void>;
  loginAsEmployer: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => ({} as User),
  register: async () => ({} as User),
  logout: async () => {},
  refreshUser: async () => {},
  loginAsCandidate: async () => {},
  loginAsEmployer: async () => {},
  loginAsAdmin: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const initAuth = async () => {
    try {
      const storedToken = localStorage.getItem('naukarix_token');
      if (storedToken) {
        setToken(storedToken);
        const res = await api.me();
        setUser(res.user);
      }
    } catch (err) {
      console.warn('Session expired or offline', err);
      localStorage.removeItem('naukarix_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('naukarix_token', res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(payload);
      setUser(res.user);
      setToken(res.token);
      localStorage.setItem('naukarix_token', res.token);
      return res.user;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.logout();
      }
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('naukarix_token');
      setUser(null);
      setToken(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.me();
      setUser(res.user);
    } catch (e) {
      console.error(e);
    }
  };

  // Demo Login Shortcuts
  const loginAsCandidate = async () => {
    await login('rahul.sharma@gmail.com', 'candidate123');
  };

  const loginAsEmployer = async () => {
    await login('hr@infosys.com', 'employer123');
  };

  const loginAsAdmin = async () => {
    await login('admin@naukarix.in', 'admin123');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        loginAsCandidate,
        loginAsEmployer,
        loginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
