"use client";

import { useAccount, useReadContract } from "wagmi";
import { useState, useEffect } from "react";
import { VERIFICATION_HUB_CONTRACT } from "@/constants/contracts";

// Define the structure of a verification result.
// Adjust the types if needed based on your contract.
interface VerificationResult {
  verifier: string;
  timestamp: bigint;
  isValid: boolean;
  proof: string;
}

export default function VerifierDashboard() {
  const { address, isConnected } = useAccount();
  const [verificationHistory, setVerificationHistory] = useState<VerificationResult[]>([]);
  const [trustScore, setTrustScore] = useState<number | null>(null);

  // Fetch verification history for the connected verifier.
  const { data: historyData, isLoading: historyLoading, error: historyError } = useReadContract({
    address: VERIFICATION_HUB_CONTRACT.address,
    abi: VERIFICATION_HUB_CONTRACT.abi,
    functionName: "getVerificationHistory",
    args: [address],
  });

  // Fetch trust score for the connected verifier.
  const { data: trustScoreData } = useReadContract({
    address: VERIFICATION_HUB_CONTRACT.address,
    abi: VERIFICATION_HUB_CONTRACT.abi,
    functionName: "calculateTrustScore",
    args: [address],
  });

  useEffect(() => {
    if (historyData) {
      // Cast the returned data to an array of VerificationResult
      setVerificationHistory(historyData as VerificationResult[]);
    }
  }, [historyData]);

  useEffect(() => {
    if (trustScoreData) {
      setTrustScore(Number(trustScoreData));
    }
  }, [trustScoreData]);

  if (!isConnected) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-red-50 dark:bg-red-900/20 rounded-xl shadow-sm border border-red-100 dark:border-red-800/30">
        <p className="text-center text-red-600 dark:text-red-300 font-medium">
          Please connect your wallet to view the verifier dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl mt-8 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Verifier Dashboard
        </h2>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/30">
          Verifier Portal
        </div>
      </div>

      {trustScore !== null && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-lg border border-indigo-100 dark:border-indigo-800/30 mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">Trust Score</p>
          <div className="flex items-center mt-1">
            <div className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">{trustScore}</div>
            <div className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400">/ 100</div>
          </div>
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
        Verification History
      </h3>
      
      {historyLoading ? (
        <div className="p-5 bg-blue-50 dark:bg-blue-900/20 rounded-lg animate-pulse border border-blue-100 dark:border-blue-800/30">
          <p className="text-center text-blue-600 dark:text-blue-300 font-medium">
            Loading verification history...
          </p>
        </div>
      ) : historyError ? (
        <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-center text-red-600 dark:text-red-300 font-medium">
            Error fetching verification history
          </p>
          <p className="text-center text-xs text-red-500 mt-1 font-mono break-words">
            {historyError.message.slice(0, 100)}...
          </p>
        </div>
      ) : verificationHistory.length === 0 ? (
        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            No verification history available yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {verificationHistory.map((result, index) => (
            <div key={index} className="p-5 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                  {result.verifier.slice(0, 10)}...{result.verifier.slice(-8)}
                </p>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  result.isValid 
                    ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800/30" 
                    : "bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800/30"
                }`}>
                  {result.isValid ? "Valid" : "Invalid"}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded mb-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">Timestamp</p>
                <p className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                  {new Date(Number(result.timestamp) * 1000).toLocaleDateString()} {new Date(Number(result.timestamp) * 1000).toLocaleTimeString()}
                </p>
              </div>
              
              {result.proof && (
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Proof</p>
                  <p className="font-mono text-xs bg-gray-50 dark:bg-gray-700 p-2 rounded overflow-x-auto text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600">
                    {result.proof}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
