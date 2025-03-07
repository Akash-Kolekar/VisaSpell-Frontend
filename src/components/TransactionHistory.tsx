"use client";

import { useAccount, useWatchContractEvent } from "wagmi";
import { decodeEventLog } from "viem";
import { useState } from "react";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

export default function TransactionHistory() {
  const { address, isConnected } = useAccount();
  const [logs, setLogs] = useState<{ type: string; message: string }[]>([]);

  // Listen for ApplicationCreated event
  useWatchContractEvent({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    eventName: "ApplicationCreated",
    onLogs(receivedLogs) {
      receivedLogs.forEach((log) => {
        try {
          const result = decodeEventLog({
            abi: STUDENT_VISA_CONTRACT.abi,
            eventName: "ApplicationCreated",
            data: log.data,
            topics: log.topics,
          });
          if (!result || !result.args) return;

          const applicant = result.args[0] as string;
          const timestamp = result.args[1] as bigint;
          const priority = result.args[2] as number;

          if (applicant.toLowerCase() === address?.toLowerCase()) {
            setLogs((prevLogs) => [
              ...prevLogs,
              {
                type: "Created",
                message: `Application created at ${new Date(
                  Number(timestamp) * 1000
                ).toLocaleString()} with priority ${priority}.`,
              },
            ]);
          }
        } catch (error) {
          console.error("Error decoding ApplicationCreated event:", error);
        }
      });
    },
  });

  // Listen for ApplicationStatusUpdated event
  useWatchContractEvent({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    eventName: "ApplicationStatusUpdated",
    onLogs(receivedLogs) {
      receivedLogs.forEach((log) => {
        try {
          const result = decodeEventLog({
            abi: STUDENT_VISA_CONTRACT.abi,
            eventName: "ApplicationStatusUpdated",
            data: log.data,
            topics: log.topics,
          });
          if (!result || !result.args) return;

          const applicant = result.args[0] as string;
          const status = result.args[1] as number;

          if (applicant.toLowerCase() === address?.toLowerCase()) {
            // Define a mapping for status codes to human-readable text
            const statusMapping: Record<number, string> = {
              0: "Pending",
              1: "Approved",
              2: "Rejected",
            };

            setLogs((prevLogs) => [
              ...prevLogs,
              {
                type: "Status Update",
                message: `Application status updated to ${statusMapping[status] || "Unknown"}.`,
              },
            ]);
          }
        } catch (error) {
          console.error("Error decoding ApplicationStatusUpdated event:", error);
        }
      });
    },
  });

  return (
    <div className="max-w-lg w-full p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
        📜 Visa Transaction History
      </h2>

      {!isConnected ? (
        <p className="text-center text-red-500">
          Connect your wallet to see your history.
        </p>
      ) : logs.length === 0 ? (
        <p className="text-center text-gray-500">
          No transactions recorded yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {logs.map((log, index) => (
            <li key={index} className="p-3 border rounded-lg bg-gray-50">
              {log.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
