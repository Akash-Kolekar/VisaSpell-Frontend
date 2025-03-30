"use client";

import { useAccount } from "wagmi";
import ApplicationDetails from "./ApplicationDetails";

export default function Profile() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm border border-red-100 dark:border-red-800/30">
        <p className="text-center text-red-600 dark:text-red-300 font-medium">
          Please connect your wallet to view your profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl mt-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        Your Profile
      </h2>
      
      <div className="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
        <p className="text-gray-600 dark:text-gray-300 font-medium flex items-center gap-2">
          <span className="text-gray-500 dark:text-gray-400">Wallet Address:</span>
          <span className="font-mono text-sm bg-white dark:bg-gray-700 px-3 py-1 rounded-md shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden text-ellipsis">
            {address}
          </span>
        </p>
      </div>
      
      {/* Show additional details, for now we re-use ApplicationDetails */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
        <ApplicationDetails />
      </div>
    </div>
  );
}
