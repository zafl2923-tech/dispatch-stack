// Authentication utilities for secure token management and API calls

const TOKEN_KEY = 'dispatch_token';
const USER_KEY = 'dispatch_user';
const TOKEN_EXPIRY_KEY = 'dispatch_token_expiry';

export interface User {
  username: string;
  email: string;
  role: 'Admin' | 'Dispatcher' | 'Trucker';
  driverId?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
  driverId?: string;
}

// Secure token storage using sessionStorage (cleared when browser closes)
// For maximum security, tokens should be in HttpOnly cookies (requires backend changes)
export const TokenStorage = {
  set: (token: string, expiresInDays: number = 7): void => {
    if (typeof window === 'undefined') return;
    
    try {
      // Store token
      sessionStorage.setItem(TOKEN_KEY, token);
      
      // Calculate and store expiry
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + expiresInDays);
      sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiryDate.toISOString());
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  get: (): string | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const token = sessionStorage.getItem(TOKEN_KEY);
      const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
      
      if (!token || !expiry) return null;
      
      // Check if token is expired
      if (new Date() > new Date(expiry)) {
        TokenStorage.clear();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Failed to clear token:', error);
    }
  },

  isValid: (): boolean => {
    return TokenStorage.get() !== null;
  }
};

// User data storage
export const UserStorage = {
  set: (user: User): void => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to store user:', error);
    }
  },

  get: (): User | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = sessionStorage.getItem(USER_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to retrieve user:', error);
      return null;
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      sessionStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error('Failed to clear user:', error);
    }
  }
};

// Secure API client with automatic token injection
export class ApiClient {
  private static baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  private static getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = TokenStorage.get();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Login (no auth required)
  static async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(error.message || 'Invalid credentials');
    }

    return response.json();
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    const response = await fetch(`${this.baseUrl}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to get user information');
    }

    return response.json();
  }

  // Generic authenticated GET request
  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });

    if (response.status === 401) {
      // Token expired or invalid
      TokenStorage.clear();
      UserStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Generic authenticated POST request
  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      TokenStorage.clear();
      UserStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Generic authenticated PUT request
  static async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      TokenStorage.clear();
      UserStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Generic authenticated DELETE request
  static async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    if (response.status === 401) {
      TokenStorage.clear();
      UserStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }
  }
}

// Input sanitization to prevent XSS attacks
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent script injection
    .substring(0, 255); // Limit length
};

// Password strength validator
export const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  return { valid: true, message: '' };
};

// Email validator
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
