"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

export default function DocumentUpload() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    docType: "0", // Example: 0 for passport, 1 for visa, etc.
    documentHash: "",
    expiryDate: "",
  });

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }

    // Convert expiryDate from date to UNIX timestamp (in seconds)
    const expiryTimestamp = Math.floor(new Date(formData.expiryDate).getTime() / 1000);

    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "submitDocument",
        args: [
          address, // Applicant address is the connected wallet
          parseInt(formData.docType), // Document type as uint8
          formData.documentHash, // Document hash (e.g., IPFS hash)
          BigInt(expiryTimestamp), // Expiry date as BigInt
        ],
      });
    } catch (err) {
      console.error("Transaction failed:", err);
    }
  };

  return (
    <div className="max-w-lg w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        Document Upload
      </h2>

      {!isConnected ? (
        <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-center text-red-600 dark:text-red-300 font-medium">
            Please connect your wallet to upload a document.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Document Type
            </label>
            <select
              name="docType"
              value={formData.docType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              required
            >
              <option value="0">Passport</option>
              <option value="1">Visa</option>
              <option value="2">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Document Hash
            </label>
            <input
              type="text"
              name="documentHash"
              value={formData.documentHash}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              placeholder="Enter document hash (e.g., IPFS hash)"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiry Date
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all mt-4 ${
              isPending ? 
                "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" : 
                "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-sm"
            }`}
            disabled={isPending}
          >
            {isPending ? "Processing..." : "Upload Document"}
          </button>

          {isSuccess && (
            <div className="p-3 mt-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
              <p className="text-center text-green-600 dark:text-green-300 font-medium">
                Document uploaded successfully!
              </p>
            </div>
          )}
          
          {error && (
            <div className="p-3 mt-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
              <p className="text-center text-red-600 dark:text-red-300 font-medium">
                Error uploading document
              </p>
              <p className="text-center text-xs text-red-500 mt-1 font-mono break-words">
                {error.message.slice(0, 100)}...
              </p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
