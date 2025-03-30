"use client";

import UniversityDashboard from "@/components/UniversityDashboard";

export default function UniversityPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">University Dashboard</h1>
        <p className="text-blue-100">Manage student applications and verification requests</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <UniversityDashboard />
      </div>
    </div>
  );
}
