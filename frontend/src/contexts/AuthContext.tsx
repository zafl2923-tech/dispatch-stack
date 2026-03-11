'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ApiClient, TokenStorage, UserStorage, User, AuthResponse } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ['/login'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount and route changes
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async (): Promise<boolean> => {
    try {
      // Check if token exists
      if (!TokenStorage.isValid()) {
        setUser(null);
        setIsLoading(false);
        
        // Redirect to login if not on a public route
        if (pathname && !PUBLIC_ROUTES.includes(pathname)) {
          router.push('/login');
        }
        
        return false;
      }

      // Check if user data exists in storage
      const storedUser = UserStorage.get();
      if (storedUser) {
        setUser(storedUser);
        setIsLoading(false);
        return true;
      }

      // Validate token with backend
      const userData = await ApiClient.getCurrentUser();
      
      // Store user data
      const userObj: User = {
        username: userData.username,
        email: userData.email,
        role: userData.role as 'Admin' | 'Dispatcher' | 'Trucker',
        driverId: userData.driverId,
      };
      
      setUser(userObj);
      UserStorage.set(userObj);
      setIsLoading(false);
      
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      TokenStorage.clear();
      UserStorage.clear();
      setIsLoading(false);
      
      // Redirect to login if not already there
      if (pathname && !PUBLIC_ROUTES.includes(pathname)) {
        router.push('/login');
      }
      
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<void> => {
    try {
      // Call login API
      const response: AuthResponse = await ApiClient.login(username, password);
      
      // Store token
      TokenStorage.set(response.token, 7);
      
      // Store user data
      const userObj: User = {
        username: response.username,
        email: response.email,
        role: response.role as 'Admin' | 'Dispatcher' | 'Trucker',
        driverId: response.driverId,
      };
      
      setUser(userObj);
      UserStorage.set(userObj);
      
      // Redirect based on role
      if (userObj.role === 'Trucker') {
        router.push('/trucker-dashboard');
      } else if (userObj.role === 'Dispatcher') {
        router.push('/dispatcher-dashboard');
      } else if (userObj.role === 'Admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/');
      }
    } catch (error) {
      // Clear any partial state
      TokenStorage.clear();
      UserStorage.clear();
      setUser(null);
      throw error;
    }
  };

  const logout = (): void => {
    // Clear all auth data
    TokenStorage.clear();
    UserStorage.clear();
    setUser(null);
    
    // Redirect to login
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
