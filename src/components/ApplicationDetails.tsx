"use client";

import { useAccount, useReadContract } from "wagmi";
import { STUDENT_VISA_CONTRACT, VISA_STATUS, PRIORITY_LEVEL } from "@/constants/contracts";

export default function ApplicationDetails() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, error } = useReadContract({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    functionName: "getApplicationDetails",
    args: [address],
  });

  if (!isConnected) {
    return (
      <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
        <p className="text-center text-red-600 dark:text-red-300 font-medium">
          Please connect your wallet to view application details.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse border border-blue-100 dark:border-blue-800/30">
        <p className="text-center text-blue-600 dark:text-blue-300 font-medium">
          Loading application details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
        <p className="text-center text-red-600 dark:text-red-300 font-medium">
          Error fetching application details
        </p>
        <p className="text-center text-xs text-red-500 mt-1 font-mono break-words">
          {error.message.slice(0, 100)}...
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-300 font-medium">
          No application details found for this wallet address.
        </p>
      </div>
    );
  }

  // Destructure returned tuple
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
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
        Application Details
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
          <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
          <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
            {VISA_STATUS[status] || "Unknown"}
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
          <p className="text-sm text-gray-500 dark:text-gray-400">Credibility Score</p>
          <p className="text-lg font-semibold text-indigo-700 dark:text-indigo-300">
            {Number(credibilityScore)}
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
            <p className="text-xs text-gray-500 dark:text-gray-400">Created At</p>
            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
              {new Date(Number(createdAt) * 1000).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(Number(createdAt) * 1000).toLocaleTimeString()}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
            <p className="text-xs text-gray-500 dark:text-gray-400">Updated At</p>
            <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
              {new Date(Number(updatedAt) * 1000).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(Number(updatedAt) * 1000).toLocaleTimeString()}
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Timeline Details</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Target Date</p>
              <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                {new Date(timeline.targetDate * 1000).toLocaleDateString()}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Deadline</p>
              <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                {new Date(timeline.deadlineDate * 1000).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Priority</p>
              <p className="font-medium text-gray-800 dark:text-gray-200">
                {PRIORITY_LEVEL[timeline.priority] || "Unknown"}
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
              <p className="text-xs text-gray-500 dark:text-gray-400">Expedited</p>
              <p className={`font-medium ${timeline.isExpedited ? "text-green-600 dark:text-green-400" : "text-gray-600 dark:text-gray-400"}`}>
                {timeline.isExpedited ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
