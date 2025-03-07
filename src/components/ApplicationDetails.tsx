"use client";

import { useAccount, useReadContract } from "wagmi";
import { STUDENT_VISA_CONTRACT, VISA_STATUS, PRIORITY_LEVEL } from "@/constants/contracts";

export default function ApplicationDetails() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, error } = useReadContract({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    functionName: "getApplicationDetails",
    args: [address],
  });

  if (!isConnected) {
    return <p className="text-center text-red-500">Connect your wallet to view your application details.</p>;
  }

  if (isLoading) {
    return <p className="text-center text-blue-500">Loading application details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (!data) {
    return <p className="text-center text-gray-500">No application details found.</p>;
  }

  // Destructure returned tuple
  const [status, credibilityScore, createdAt, updatedAt, timeline] = data as [
    number,
    bigint,
    bigint,
    bigint,
    {
      targetDate: number;
      deadlineDate: number;
      priority: number;
      isExpedited: boolean;
    }
  ];

  return (
    <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Application Details</h2>
      <div className="space-y-3">
        <p>
          <strong>Status:</strong> {VISA_STATUS[status] || "Unknown"}
        </p>
        <p>
          <strong>Credibility Score:</strong> {Number(credibilityScore)}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(Number(createdAt) * 1000).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(Number(updatedAt) * 1000).toLocaleString()}
        </p>
        <div className="mt-4 border-t pt-4">
          <p>
            <strong>Timeline Target Date:</strong>{" "}
            {new Date(timeline.targetDate * 1000).toLocaleString()}
          </p>
          <p>
            <strong>Timeline Deadline Date:</strong>{" "}
            {new Date(timeline.deadlineDate * 1000).toLocaleString()}
          </p>
          <p>
            <strong>Priority:</strong> {PRIORITY_LEVEL[timeline.priority] || "Unknown"}
          </p>
          <p>
            <strong>Expedited:</strong> {timeline.isExpedited ? "Yes" : "No"}
          </p>
        </div>
      </div>
    </div>
  );
}
