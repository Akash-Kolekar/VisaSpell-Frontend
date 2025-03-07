"use client";

import { useAccount, useWriteContract, useReadContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";
import { useState } from "react";

// Define an interface for application objects
export interface Application {
  student: string;
  universityId: string;
  programId: string;
  priority: number;
  status: number;
  // Add other properties if your application object includes more details (e.g., timestamps)
}

export default function ReviewApplications() {
  const { address, isConnected } = useAccount();

  // Fetch pending applications from the smart contract.
  // Note: This assumes your contract has a function named "getPendingApplications"
  // that returns an array of Application objects.
  const { data, isLoading, error } = useReadContract({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    functionName: "getPendingApplications",
  });

  // Cast the returned data to an array of Application objects
  const applications = data as Application[];

  const { writeContract } = useWriteContract();

  const handleReview = async (studentAddress: string, decision: boolean) => {
    if (!isConnected) {
      alert("Please connect your wallet first.");
      return;
    }
    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "reviewApplication", // Adjust the function name if needed
        args: [studentAddress, decision],
      });
      alert(`Application ${decision ? "approved" : "rejected"} successfully!`);
    } catch (err: any) {
      console.error("Error reviewing application:", err);
      alert("Failed to review application. Check the console for details.");
    }
  };

  if (isLoading) {
    return <p className="text-center text-blue-500">Loading applications...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (!applications || applications.length === 0) {
    return <p className="text-center text-gray-500">No pending applications.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Review Applications</h2>
      <ul className="space-y-4">
        {applications.map((app: Application, index: number) =>
          // Here, we assume that a status of 0 means "pending"
          app.status === 0 ? (
            <li key={index} className="p-4 border rounded-lg bg-gray-50">
              <p className="text-lg">
                <strong>Student:</strong> {app.student}
              </p>
              <p>
                <strong>University ID:</strong> {app.universityId}
              </p>
              <p>
                <strong>Program ID:</strong> {app.programId}
              </p>
              <p>
                <strong>Priority:</strong> {app.priority}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {app.status === 0 ? "Pending" : app.status === 1 ? "Approved" : "Rejected"}
              </p>
              {app.status === 0 && (
                <div className="flex space-x-2 mt-2">
                  <button
                    className="bg-green-500 text-white p-2 rounded-lg"
                    onClick={() => handleReview(app.student, true)}
                  >
                    Approve
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded-lg"
                    onClick={() => handleReview(app.student, false)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
}
