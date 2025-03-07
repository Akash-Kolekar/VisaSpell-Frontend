"use client";

import { useReadContract } from "wagmi";
import { STUDENT_VISA_CONTRACT, VISA_STATUS, PRIORITY_LEVEL } from "@/constants/contracts";

interface ApplicationCardProps {
  applicantAddress: string;
}

export default function ApplicationCard({ applicantAddress }: ApplicationCardProps) {
  const { data, isLoading, error } = useReadContract({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    functionName: "getApplicationDetails",
    args: [applicantAddress],
  });

  if (isLoading) {
    return (
      <p className="text-center text-blue-500">
        Loading details for {applicantAddress}...
      </p>
    );
  }
  if (error) {
    return (
      <p className="text-center text-red-500">
        Error: {error.message} for {applicantAddress}
      </p>
    );
  }
  if (!data) {
    return (
      <p className="text-center text-gray-500">
        No details found for {applicantAddress}.
      </p>
    );
  }

  // Destructure returned tuple from getApplicationDetails:
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
    <div className="p-4 border rounded-lg bg-gray-50">
      <p><strong>Applicant:</strong> {applicantAddress}</p>
      <p><strong>Status:</strong> {VISA_STATUS[status] || "Unknown"}</p>
      <p><strong>Credibility Score:</strong> {Number(credibilityScore)}</p>
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(Number(createdAt) * 1000).toLocaleString()}
      </p>
      <p>
        <strong>Updated At:</strong>{" "}
        {new Date(Number(updatedAt) * 1000).toLocaleString()}
      </p>
      <div className="mt-2 border-t pt-2">
        <p>
          <strong>Timeline Target Date:</strong>{" "}
          {new Date(timeline.targetDate * 1000).toLocaleString()}
        </p>
        <p>
          <strong>Timeline Deadline Date:</strong>{" "}
          {new Date(timeline.deadlineDate * 1000).toLocaleString()}
        </p>
        <p>
          <strong>Priority:</strong>{" "}
          {PRIORITY_LEVEL[timeline.priority] || "Unknown"}
        </p>
        <p>
          <strong>Expedited:</strong> {timeline.isExpedited ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
}
