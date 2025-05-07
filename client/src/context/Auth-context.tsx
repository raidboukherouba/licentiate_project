// AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import apiClient from '../services/apiClient'; // Adjust the import path

interface User {
  user_id: number;
  username: string;
  full_name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Retrieve user data from localStorage on initial load
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const userData = response.data.user;
      setUser(userData);

      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      throw err; // Propagate the error to the login form
    }
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
      setUser(null);

      // Remove user data from localStorage
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};