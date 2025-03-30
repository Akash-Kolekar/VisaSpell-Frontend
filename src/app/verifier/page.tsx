"use client";

import VerifierDashboard from "@/components/VerifierDashboard";

export default function VerifierPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Verifier Dashboard</h1>
        <p className="text-green-100">Verify student applications and documents</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <VerifierDashboard />
      </div>
    </div>
  );
}
