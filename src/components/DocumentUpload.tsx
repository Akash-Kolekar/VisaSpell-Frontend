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
      alert("Document submitted successfully!");
    } catch (err) {
      console.error("Transaction failed:", err);
      alert("Failed to submit document. Check console for details.");
    }
  };

  return (
    <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Upload Document</h2>

      {!isConnected ? (
        <p className="text-center text-red-500">Please connect your wallet to upload a document.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold">Document Type</label>
            <select
              name="docType"
              value={formData.docType}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="0">Passport</option>
              <option value="1">Visa</option>
              <option value="2">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Document Hash</label>
            <input
              type="text"
              name="documentHash"
              value={formData.documentHash}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter document hash (e.g., IPFS hash)"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold">Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full p-3 rounded-lg font-bold transition-all ${
              isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Document"}
          </button>

          {isSuccess && <p className="text-center text-green-500 mt-3">Document submitted successfully!</p>}
          {error && <p className="text-center text-red-500 mt-3">Error: {error.message}</p>}
        </form>
      )}
    </div>
  );
}
