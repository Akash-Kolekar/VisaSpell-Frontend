"use client";

import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";
import { useState } from "react";

// Define an interface for application objects
export interface Application {
  student: string;
  universityId: string;
  programId: string;
  priority: number;
  status: number;
  // Add other properties if your application object includes more details (e.g., timestamps)
}

export default function ReviewApplications() {
  const { address, isConnected } = useAccount();

  // Fetch pending applications from the smart contract.
  // Note: This assumes your contract has a function named "getPendingApplications"
  // that returns an array of Application objects.
  const { data, isLoading, error } = useReadContract({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    functionName: "getPendingApplications",
  });

  // Cast the returned data to an array of Application objects
  const applications = data as Application[];

  const { writeContract, isPending } = useWriteContract();

  const handleReview = async (studentAddress: string, decision: boolean) => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "reviewApplication", // Adjust the function name if needed
        args: [studentAddress, decision],
      });
    } catch (err: any) {
      console.error("Error reviewing application:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl mt-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Review Applications
        </h2>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/30">
          Reviewer Portal
        </div>
      </div>

      {isLoading ? (
        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse border border-blue-100 dark:border-blue-800/30">
          <p className="text-center text-blue-600 dark:text-blue-300 font-medium">
            Loading applications...
          </p>
        </div>
      ) : error ? (
        <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-center text-red-600 dark:text-red-300 font-medium">
            Error fetching applications
          </p>
          <p className="text-center text-xs text-red-500 mt-1 font-mono break-words">
            {error.message.slice(0, 100)}...
          </p>
        </div>
      ) : !applications || applications.length === 0 ? (
        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            No pending applications available for review.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {applications.map((app: Application, index: number) =>
            // Here, we assume that a status of 0 means "pending"
            app.status === 0 ? (
              <div key={index} className="p-6 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">Application Review</h3>
                    <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">
                      {app.student.slice(0, 10)}...{app.student.slice(-8)}
                    </p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-800/30">
                    Pending Decision
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                    <p className="text-xs text-gray-500 dark:text-gray-400">University ID</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{app.universityId}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Program ID</p>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{app.programId}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded mb-5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Priority Level</p>
                  <p className="font-semibold text-gray-800 dark:text-gray-200">
                    {app.priority === 0 ? "Standard" : app.priority === 1 ? "Expedited" : "Emergency"}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleReview(app.student, true)}
                    disabled={isPending}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleReview(app.student, false)}
                    disabled={isPending}
                    className="px-4 py-2 rounded-lg font-medium transition-all bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-700 hover:to-rose-600 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}
