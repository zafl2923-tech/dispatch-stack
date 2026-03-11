'use client'

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Array<'Admin' | 'Dispatcher' | 'Trucker'>;
}

export default function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // Not authenticated - redirect to login
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Check role-based access
      if (requiredRoles && user && !requiredRoles.includes(user.role)) {
        // User doesn't have required role - redirect to their default dashboard
        if (user.role === 'Trucker') {
          router.push('/trucker-dashboard');
        } else if (user.role === 'Dispatcher') {
          router.push('/dispatcher-dashboard');
        } else if (user.role === 'Admin') {
          router.push('/admin-dashboard');
        } else {
          router.push('/login');
        }
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show nothing (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Check role requirements
  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return null; // Will redirect via useEffect
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
}
