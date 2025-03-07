"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

export default function BiometricVerification() {
  const { address, isConnected } = useAccount();
  const [biometricHash, setBiometricHash] = useState("");
  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "submitBiometricVerification",
        args: [biometricHash],
      });
      alert("Biometric verification submitted successfully!");
      setBiometricHash("");
    } catch (err: any) {
      console.error("Error submitting biometric verification:", err);
      alert("Failed to submit biometric verification. Check the console for details.");
    }
  };

  return (
    <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Biometric Verification
      </h2>
      {!isConnected ? (
        <p className="text-center text-red-500">
          Connect your wallet to verify biometrics.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold">
              Biometric Hash
            </label>
            <input
              type="text"
              value={biometricHash}
              onChange={(e) => setBiometricHash(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your biometric hash"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full p-3 rounded-lg font-bold transition-all ${
              isPending
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Verification"}
          </button>
          {isSuccess && (
            <p className="text-center text-green-500 mt-3">
              Biometric verification submitted!
            </p>
          )}
          {error && (
            <p className="text-center text-red-500 mt-3">
              Error: {error.message}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
