"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

export default function AdminDashboard() {
  const { address, isConnected } = useAccount();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(""); // Amount in ETH as a string

  const { writeContract, isPending, isSuccess, error } = useWriteContract();

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    if (!recipient || !amount) {
      alert("Please provide both a recipient address and an amount.");
      return;
    }

    try {
      // Convert the amount (in ETH) to wei (BigInt)
      const amountWei = BigInt(Math.floor(parseFloat(amount) * 1e18));
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "withdrawFees",
        args: [recipient, amountWei],
      });
      setRecipient("");
      setAmount("");
    } catch (err: any) {
      console.error("Withdrawal failed:", err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Admin Dashboard
        </h2>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/30">
          Admin
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 p-5 rounded-lg border border-indigo-100 dark:border-indigo-800/30 mb-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          Withdraw Fees
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Transfer funds from the contract to a specified address.
        </p>
        
        <form onSubmit={handleWithdraw} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Recipient Address
            </label>
            <input
              type="text"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Amount (ETH)
            </label>
            <input
              type="number"
              placeholder="0.0"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
              isPending ? 
                "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed" : 
                "bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white shadow-sm"
            }`}
          >
            {isPending ? "Processing..." : "Withdraw Funds"}
          </button>
        </form>
      </div>
      
      {isSuccess && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800/30">
          <p className="text-center text-green-600 dark:text-green-300 font-medium">
            Withdrawal completed successfully!
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-center text-red-600 dark:text-red-300 font-medium">
            Error processing withdrawal
          </p>
          <p className="text-center text-xs text-red-500 mt-1 font-mono break-words">
            {error.message.slice(0, 100)}...
          </p>
        </div>
      )}
    </div>
  );
}
