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
      <p className="text-center text-red-500">
        Connect your wallet to view verification history.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Verifier Dashboard</h2>
      {trustScore !== null && (
        <p className="text-center mb-4">
          Trust Score: <strong>{trustScore}</strong>
        </p>
      )}
      {historyLoading ? (
        <p className="text-center text-blue-500">Loading verification history...</p>
      ) : historyError ? (
        <p className="text-center text-red-500">Error: {historyError.message}</p>
      ) : verificationHistory.length === 0 ? (
        <p className="text-center text-gray-500">No verification history available.</p>
      ) : (
        <ul className="space-y-4">
          {verificationHistory.map((result, index) => (
            <li key={index} className="p-4 border rounded-lg bg-gray-50">
              <p>
                <strong>Verifier:</strong> {result.verifier}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(Number(result.timestamp) * 1000).toLocaleString()}
              </p>
              <p>
                <strong>Result:</strong> {result.isValid ? "Valid" : "Invalid"}
              </p>
              <p>
                <strong>Proof:</strong> {result.proof}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
