'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Truck, LogOut, Users, TruckIcon, Building2, Settings } from 'lucide-react';

export default function DispatcherDashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requiredRoles={['Dispatcher', 'Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dispatcher Dashboard</h1>
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
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Drivers</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">24</p>
              <p className="text-sm text-green-600 mt-1">18 active</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <TruckIcon className="w-5 h-5 text-indigo-600" />
                <h3 className="font-semibold text-gray-900">Trucks</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">32</p>
              <p className="text-sm text-green-600 mt-1">28 on road</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">Companies</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600 mt-1">8 exporters</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-gray-900">HOS Alerts</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-600">3</p>
              <p className="text-sm text-gray-600 mt-1">Requires attention</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="text-left px-4 py-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">Manage Drivers</p>
                <p className="text-sm text-gray-600 mt-1">Add, edit, or view driver profiles</p>
              </button>
              <button className="text-left px-4 py-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200">
                <TruckIcon className="w-6 h-6 text-indigo-600 mb-2" />
                <p className="font-medium text-gray-900">Manage Fleet</p>
                <p className="text-sm text-gray-600 mt-1">View and update truck information</p>
              </button>
              <button className="text-left px-4 py-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
                <Building2 className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">Companies</p>
                <p className="text-sm text-gray-600 mt-1">Manage exporter/importer data</p>
              </button>
            </div>
          </div>

          {/* Role info */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Access Level</h2>
            <p className="text-sm text-gray-700 mb-4">
              As a <span className="font-semibold text-indigo-600">{user?.role}</span>, you have full 
              operational access to manage drivers, trucks, and companies. You can create trucker accounts 
              and view all system data.
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                Full CRUD Access
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                User Management
              </span>
              <span className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-200">
                Fleet Operations
              </span>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
