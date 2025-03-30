"use client";

import ApplicationCard from "@/components/ApplicationCard";
import { APPLICATION_ADDRESSES } from "@/constants/contracts";

export default function UniversityDashboard() {
  return (
    <div className="max-w-5xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl mt-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        University Dashboard
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {APPLICATION_ADDRESSES.map((addr, idx) => (
          <ApplicationCard key={idx} applicantAddress={addr} />
        ))}
      </div>
    </div>
  );
}
