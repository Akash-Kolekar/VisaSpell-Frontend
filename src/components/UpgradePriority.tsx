"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";
import { useState, useEffect } from "react";

export default function UpgradePriority() {
  const { address, isConnected } = useAccount();
  const [currentPriority, setCurrentPriority] = useState<number | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string>("0");
  const [requiredFee, setRequiredFee] = useState<bigint>(BigInt(0));

  // Read current timeline priority from the contract using getTimelinePriority
  const { data: timelinePriority } = useReadContract({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    functionName: "getTimelinePriority",
    args: [address],
  });

  useEffect(() => {
    if (timelinePriority !== undefined) {
      setCurrentPriority(Number(timelinePriority));
    }
  }, [timelinePriority, address]);

  // Calculate required additional fee based on current and selected priority
  useEffect(() => {
    // Hardcoded fee values in wei:
    // standardFee = 0.000001 ETH, expeditedFee = 0.000003 ETH, emergencyFee = 0.000005 ETH
    const standardFee = BigInt(1000000000000); // 1e12 wei
    const expeditedFee = BigInt(3000000000000); // 3e12 wei
    const emergencyFee = BigInt(5000000000000); // 5e12 wei

    const newPriority = parseInt(selectedPriority);
    let feeDifference = BigInt(0);

    if (currentPriority !== null) {
      if (newPriority <= currentPriority) {
        feeDifference = BigInt(0);
      } else if (newPriority === 1) {
        // Upgrade from Standard to Expedited
        feeDifference = expeditedFee - standardFee;
      } else if (newPriority === 2) {
        if (currentPriority === 0) {
          feeDifference = emergencyFee - standardFee;
        } else if (currentPriority === 1) {
          feeDifference = emergencyFee - expeditedFee;
        }
      }
    }
    setRequiredFee(feeDifference);
  }, [selectedPriority, currentPriority]);

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleUpgrade = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet.");
      return;
    }

    const newPriority = parseInt(selectedPriority);
    if (currentPriority !== null && newPriority <= currentPriority) {
      alert("Please select a higher priority than your current one.");
      return;
    }

    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "upgradeProcessingPriority",
        args: [newPriority],
        value: requiredFee,
      });
    } catch (err: any) {
      console.error("Upgrade failed:", err);
    }
  };

  return (
    <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        Upgrade Processing Priority
      </h2>
      
      {!isConnected ? (
        <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-center text-red-600 dark:text-red-300 font-medium">
            Please connect your wallet to upgrade priority.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/30">
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Priority</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {currentPriority === 0
                ? "Standard"
                : currentPriority === 1
                ? "Expedited"
                : currentPriority === 2
                ? "Emergency"
                : "Unknown"}
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select New Priority
            </label>
            <select
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="0">Standard</option>
              <option value="1">Expedited</option>
              <option value="2">Emergency</option>
            </select>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-500 dark:text-gray-400">Required Additional Fee</p>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {Number(requiredFee) / 1e18} ETH
            </p>
          </div>
          
          <button
            onClick={handleUpgrade}
            disabled={isPending || requiredFee <= 0}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isPending || requiredFee <= 0
                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-sm"
            }`}
          >
            {isPending ? "Processing..." : requiredFee <= 0 ? "No Upgrade Available" : "Upgrade Priority"}
          </button>
          
          {isSuccess && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
              <p className="text-center text-green-600 dark:text-green-300 font-medium">
                Priority upgraded successfully!
              </p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
              <p className="text-center text-red-600 dark:text-red-300 font-medium">
                Error upgrading priority
              </p>
              <p className="text-center text-xs text-red-500 mt-1 font-mono break-words">
                {error.message.slice(0, 100)}...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
