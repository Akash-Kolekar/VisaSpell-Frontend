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
      alert("Withdrawal successful!");
      setRecipient("");
      setAmount("");
    } catch (err: any) {
      console.error("Withdrawal failed:", err);
      alert("Withdrawal failed. Check the console for details.");
    }
  };

  return (
    <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        Admin Dashboard
      </h2>
      <form onSubmit={handleWithdraw} className="space-y-5">
        <input
          type="text"
          placeholder="Recipient address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <input
          type="number"
          placeholder="Amount in ETH"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 border rounded-lg"
          required
        />
        <button
          type="submit"
          disabled={isPending}
          className={`w-full p-3 rounded-lg font-bold transition-all ${
            isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {isPending ? "Processing..." : "Withdraw Fees"}
        </button>
        {isSuccess && (
          <p className="text-center text-green-500 mt-3">
            Withdrawal successful!
          </p>
        )}
        {error && (
          <p className="text-center text-red-500 mt-3">
            Error: {error.message}
          </p>
        )}
      </form>
    </div>
  );
}
