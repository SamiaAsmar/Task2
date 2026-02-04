'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import axios from 'axios';
import { User } from '@/app/types/user';
import { ROLE_PERMISSIONS } from '@/app/types/permissions';

type AuthContextType = {
  user: User | null;
  token: string | null;
  loading: boolean;
  permissions: string[];
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const permissions = user
    ? ROLE_PERMISSIONS[user.role] || []
    : [];

  const fetchUser = async () => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/api/me', {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      setUser(res.data);
      setToken(storedToken);
    } catch (err) {
      console.error(err);
      localStorage.removeItem('token');
      setUser(null);
      setToken(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (
    email: string,
    password: string,
    role: string
  ) => {
    setLoading(true);

    const res = await axios.post('/api/login', {
      email,
      password,
      role,
    });

    const { token } = res.data;

    localStorage.setItem('token', token);
    setToken(token);

    await fetchUser();
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        permissions,
        login,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};
