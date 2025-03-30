"use client";

import EmbassyDashboard from "@/components/EmbassyDashboard";

export default function EmbassyPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Embassy Dashboard</h1>
        <p className="text-red-100">Process and manage student visa applications</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <EmbassyDashboard />
      </div>
    </div>
  );
}
