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
        value: VISA_FEES[parseInt(formData.priority) as 0 | 1 | 2], // ✅ TypeScript now recognizes the index
      });

      alert("✅ Visa application submitted with payment!");
    } catch (error) {
      console.error("❌ Transaction failed:", error);
      alert("❌ Payment failed. Check the console for details.");
    }
  };

  return (
    <div className="max-w-lg w-full p-8 bg-white shadow-lg rounded-xl mt-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">🛂 Apply for a Visa</h2>

      {!isConnected ? (
        <p className="text-center text-red-500 font-semibold">
          Please connect your wallet to apply.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="universityId"
            value={formData.universityId}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            placeholder="University ID"
            required
          />
          <input
            type="text"
            name="programId"
            value={formData.programId}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Program ID"
            required
          />
          <input
            type="date"
            name="enrollmentDate"
            value={formData.enrollmentDate}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          >
            <option value="0">Standard (0.000001 ETH)</option>
            <option value="1">Expedited (0.000003 ETH)</option>
            <option value="2">Emergency (0.000005 ETH)</option>
          </select>
          <input
            type="text"
            name="previousVisaCountries"
            value={formData.previousVisaCountries}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            placeholder="Previous Visa Countries (comma-separated)"
          />
          <button
            type="submit"
            className={`w-full p-3 rounded-lg font-bold transition-all ${
              isPending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={isPending}
          >
            {isPending ? "Processing Payment..." : "Submit & Pay"}
          </button>

          {isSuccess && <p className="text-center text-green-500 mt-3">✅ Payment Successful!</p>}
          {error && <p className="text-center text-red-500 mt-3">❌ {error.message}</p>}
        </form>
      )}
    </div>
  );
}
