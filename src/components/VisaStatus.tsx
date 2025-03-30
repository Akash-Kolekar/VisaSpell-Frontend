"use client";

import { useAccount, useReadContract } from "wagmi";
import { STUDENT_VISA_CONTRACT, VISA_STATUS } from "@/constants/contracts";

export default function VisaStatus() {
  const { address, isConnected } = useAccount();

  // Fetch visa status from the blockchain
  const { data, isLoading, error } = useReadContract({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    functionName: "getApplicationStatus",
    args: [address],
  });

  return (
    <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100 dark:border-gray-700 transition-all">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        Visa Application Status
      </h2>

      {!isConnected ? (
        <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-red-600 dark:text-red-300 font-medium">
            Please connect your wallet to check your visa status.
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse border border-blue-100 dark:border-blue-800/30">
          <p className="text-blue-600 dark:text-blue-300 font-medium">
            Loading status...
          </p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-red-600 dark:text-red-300 font-medium">
            Error fetching status. Please try again.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-5 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">Current Status</p>
          <p className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">
            {VISA_STATUS[Number(data)] || "Unknown"}
          </p>
        </div>
      )}
    </div>
  );
}
