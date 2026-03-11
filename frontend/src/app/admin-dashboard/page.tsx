'use client'

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { Truck, LogOut, Shield, Users, TruckIcon, Building2, Settings, UserPlus } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute requiredRoles={['Admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-red-600 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
          {/* System overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Users</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">48</p>
              <p className="text-sm text-gray-600 mt-1">3 roles</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-green-600" />
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
              <p className="text-sm text-gray-600 mt-1">All types</p>
            </div>
          </div>

          {/* Admin actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Administrative Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="text-left px-4 py-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200">
                <UserPlus className="w-6 h-6 text-red-600 mb-2" />
                <p className="font-medium text-gray-900">Create Admin</p>
                <p className="text-sm text-gray-600 mt-1">Add new administrator</p>
              </button>
              <button className="text-left px-4 py-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200">
                <Users className="w-6 h-6 text-blue-600 mb-2" />
                <p className="font-medium text-gray-900">User Management</p>
                <p className="text-sm text-gray-600 mt-1">Manage all user accounts</p>
              </button>
              <button className="text-left px-4 py-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200">
                <Settings className="w-6 h-6 text-indigo-600 mb-2" />
                <p className="font-medium text-gray-900">System Settings</p>
                <p className="text-sm text-gray-600 mt-1">Configure system options</p>
              </button>
              <button className="text-left px-4 py-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200">
                <Shield className="w-6 h-6 text-purple-600 mb-2" />
                <p className="font-medium text-gray-900">Security</p>
                <p className="text-sm text-gray-600 mt-1">View security logs</p>
              </button>
            </div>
          </div>

          {/* Full access grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">System Resources</h2>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-900">Manage Drivers</p>
                  <p className="text-sm text-gray-600 mt-1">Full CRUD access to driver records</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-900">Manage Trucks</p>
                  <p className="text-sm text-gray-600 mt-1">Full CRUD access to fleet data</p>
                </button>
                <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <p className="font-medium text-gray-900">Manage Companies</p>
                  <p className="text-sm text-gray-600 mt-1">Full CRUD access to company records</p>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-red-600" />
                <h2 className="text-lg font-semibold text-gray-900">Administrator Privileges</h2>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                You have complete system access. Use your privileges responsibly:
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>Create and manage admin, dispatcher, and trucker accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>Full CRUD access to all system resources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>Access to system configuration and security settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>View audit logs and system analytics</span>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
