import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, LogOut, User, Settings, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="bg-primary-600 p-2 rounded-lg">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">GlobeTrotter</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-gray-700 font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
              </div>
              <button
                onClick={logout}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to plan your next adventure? Let's get started!
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Create New Trip
                </h3>
                <p className="text-gray-600 text-sm">
                  Start planning your next adventure
                </p>
              </div>
              <div className="bg-primary-100 p-3 rounded-full">
                <Plus className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  View Trips
                </h3>
                <p className="text-gray-600 text-sm">
                  See all your planned adventures
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card-hover">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Settings
                </h3>
                <p className="text-gray-600 text-sm">
                  Manage your account preferences
                </p>
              </div>
              <div className="bg-gray-100 p-3 rounded-full">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8">
            <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Globe className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-4">
              No trips planned yet. Start by creating your first adventure!
            </p>
            <button className="btn-primary">
              Create Your First Trip
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">0</div>
            <div className="text-gray-600 text-sm">Trips Planned</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">0</div>
            <div className="text-gray-600 text-sm">Cities Visited</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">0</div>
            <div className="text-gray-600 text-sm">Days Traveled</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">$0</div>
            <div className="text-gray-600 text-sm">Total Spent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
