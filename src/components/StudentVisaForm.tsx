"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { STUDENT_VISA_CONTRACT, VISA_FEES } from "@/constants/contracts";

export default function StudentVisaForm() {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    universityId: "",
    programId: "",
    enrollmentDate: "",
    priority: "0",
    previousVisaCountries: "",
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

    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "createApplication",
        args: [
          formData.universityId,
          formData.programId,
          BigInt(Math.floor(new Date(formData.enrollmentDate).getTime() / 1000)),
          parseInt(formData.priority),
          formData.previousVisaCountries.split(",").map((s) => s.trim()),
        ],
        value: VISA_FEES[parseInt(formData.priority) as 0 | 1 | 2],
      });
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Student Visa Application
        </h2>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/30">
          New Application
        </div>
      </div>

      {!isConnected ? (
        <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-center text-red-600 dark:text-red-300 font-medium">
            Please connect your wallet to apply for a visa.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              University ID
            </label>
            <input
              type="text"
              name="universityId"
              value={formData.universityId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              placeholder="Enter your university ID"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Program ID
            </label>
            <input
              type="text"
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              placeholder="Enter your program ID"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enrollment Date
            </label>
            <input
              type="date"
              name="enrollmentDate"
              value={formData.enrollmentDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority Level
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              required
            >
              <option value="0">Standard (0.000001 ETH)</option>
              <option value="1">Expedited (0.000003 ETH)</option>
              <option value="2">Emergency (0.000005 ETH)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Previous Visa Countries
            </label>
            <input
              type="text"
              name="previousVisaCountries"
              value={formData.previousVisaCountries}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              placeholder="Enter countries separated by commas"
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
            {isPending ? "Processing..." : "Submit Application & Pay Fees"}
          </button>
          
          {isSuccess && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
              <p className="text-center text-green-600 dark:text-green-300 font-medium">
                Application submitted successfully!
              </p>
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
              <p className="text-center text-red-600 dark:text-red-300 font-medium">
                Error submitting application
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
