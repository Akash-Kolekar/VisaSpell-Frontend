"use client";

import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-300">System management and user administration</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <AdminDashboard />
      </div>
    </div>
  );
}
