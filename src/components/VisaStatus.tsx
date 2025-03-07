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
    <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        🎫 Visa Application Status
      </h2>

      {!isConnected ? (
        <p className="text-center text-red-500 font-semibold">
          Please connect your wallet to check your visa status.
        </p>
      ) : isLoading ? (
        <p className="text-center text-blue-500">🔄 Loading status...</p>
      ) : error ? (
        <p className="text-center text-red-500">❌ Error fetching status</p>
      ) : (
        <p className="text-center text-lg font-semibold">
          📌 Current Status: <span className="text-blue-600">{VISA_STATUS[Number(data)] || "Unknown"}</span>
        </p>
      )}
    </div>
  );
}
