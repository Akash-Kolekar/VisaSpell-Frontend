"use client";

import { useReadContract } from "wagmi";
import { STUDENT_VISA_CONTRACT, VISA_STATUS, PRIORITY_LEVEL } from "@/constants/contracts";

interface ApplicationCardProps {
  applicantAddress: string;
}

export default function ApplicationCard({ applicantAddress }: ApplicationCardProps) {
  const { data, isLoading, error } = useReadContract({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    functionName: "getApplicationDetails",
    args: [applicantAddress],
  });

  if (isLoading) {
    return (
      <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse border border-blue-100 dark:border-blue-800/30">
        <p className="text-center text-blue-600 dark:text-blue-300 font-medium">
          Loading details for {applicantAddress.slice(0, 6)}...{applicantAddress.slice(-4)}
        </p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
        <p className="text-center text-red-600 dark:text-red-300 font-medium">
          Error fetching details
        </p>
        <p className="text-center text-xs text-red-500 mt-1 font-mono">
          {error.message.slice(0, 100)}...
        </p>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-500 dark:text-gray-400 font-medium">
          No details found for {applicantAddress.slice(0, 6)}...{applicantAddress.slice(-4)}
        </p>
      </div>
    );
  }

  // Destructure returned tuple from getApplicationDetails:
  const [status, credibilityScore, createdAt, updatedAt, timeline] = data as [
    number,
    bigint,
    bigint,
    bigint,
    {
      targetDate: number;
      deadlineDate: number;
      priority: number;
      isExpedited: boolean;
    }
  ];

  return (
    <div className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-gray-800 dark:text-gray-200">Application</h3>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
            {applicantAddress.slice(0, 10)}...{applicantAddress.slice(-8)}
          </p>
        </div>
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/30">
          {VISA_STATUS[status] || "Unknown"}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
          <p className="text-xs text-gray-500 dark:text-gray-400">Score</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200">{Number(credibilityScore)}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
          <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
          <p className="font-semibold text-gray-800 dark:text-gray-200">{PRIORITY_LEVEL[timeline.priority] || "Unknown"}</p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Created</span>
          <span className="text-gray-800 dark:text-gray-200">{new Date(Number(createdAt) * 1000).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Target Date</span>
          <span className="text-gray-800 dark:text-gray-200">{new Date(timeline.targetDate * 1000).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Deadline</span>
          <span className="text-gray-800 dark:text-gray-200">{new Date(timeline.deadlineDate * 1000).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Expedited</span>
          <span className={`font-medium ${timeline.isExpedited ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}>
            {timeline.isExpedited ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
}
