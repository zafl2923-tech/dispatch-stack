'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Truck, LogOut, User, Clock, MapPin } from 'lucide-react';

export default function TruckerDashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requiredRoles={['Trucker']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Trucker Dashboard</h1>
                  <p className="text-sm text-gray-600">Welcome back, {user?.username}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Trucker Account</p>
                <p className="text-sm text-blue-800 mt-1">
                  You have read-only access to view your driving statistics and compliance data.
                  {user?.driverId && (
                    <span className="block mt-1 text-xs text-blue-700">
                      Driver ID: {user.driverId}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Hours Today</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">8.5h</p>
              <p className="text-sm text-gray-600 mt-1">5.5 hours remaining</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Distance Today</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">342 mi</p>
              <p className="text-sm text-gray-600 mt-1">Total trip: 1,250 mi</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">HOS Status</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">Compliant</p>
              <p className="text-sm text-gray-600 mt-1">Next break in 2.5h</p>
            </div>
          </div>

          {/* Content sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Username</span>
                  <span className="text-sm font-medium text-gray-900">{user?.username}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900">{user?.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className="text-sm font-medium text-blue-600">{user?.role}</span>
                </div>
                {user?.driverId && (
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600">Driver ID</span>
                    <span className="text-sm font-mono text-gray-900">{user.driverId}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-900">View Full Profile</p>
                  <p className="text-sm text-gray-600 mt-1">See your complete driver information</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-900">HOS Logs</p>
                  <p className="text-sm text-gray-600 mt-1">View your hours of service history</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-900">Current Trip</p>
                  <p className="text-sm text-gray-600 mt-1">Track your current journey details</p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
