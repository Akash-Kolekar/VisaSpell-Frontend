"use client";

import ApplicationCard from "@/components/ApplicationCard";
import { APPLICATION_ADDRESSES } from "@/constants/contracts";

export default function UniversityDashboard() {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        University Dashboard
      </h2>
      <div className="space-y-4">
        {APPLICATION_ADDRESSES.map((addr, idx) => (
          <ApplicationCard key={idx} applicantAddress={addr} />
        ))}
      </div>
    </div>
  );
}
