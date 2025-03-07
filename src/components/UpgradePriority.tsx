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
      alert("Priority upgraded successfully!");
    } catch (err: any) {
      console.error("Upgrade failed:", err);
      alert("Failed to upgrade priority. Check the console for details.");
    }
  };

  return (
    <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Upgrade Processing Priority
      </h2>
      {!isConnected ? (
        <p className="text-center text-red-500">
          Connect your wallet to upgrade priority.
        </p>
      ) : (
        <>
          <p className="mb-2">
            Current Priority:{" "}
            {currentPriority === 0
              ? "Standard"
              : currentPriority === 1
              ? "Expedited"
              : currentPriority === 2
              ? "Emergency"
              : "Unknown"}
          </p>
          <select
            className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-400"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="0">Standard</option>
            <option value="1">Expedited</option>
            <option value="2">Emergency</option>
          </select>
          <p className="mb-4">
            Required Additional Fee: {Number(requiredFee) / 1e18} ETH
          </p>
          <button
            onClick={handleUpgrade}
            disabled={isPending}
            className={`w-full p-3 rounded-lg font-bold transition-all ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isPending ? "Processing..." : "Upgrade Priority"}
          </button>
          {isSuccess && (
            <p className="text-center text-green-500 mt-3">
              Priority upgraded successfully!
            </p>
          )}
          {error && (
            <p className="text-center text-red-500 mt-3">
              Error: {error.message}
            </p>
          )}
        </>
      )}
    </div>
  );
}
