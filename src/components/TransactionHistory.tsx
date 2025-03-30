"use client";

import { useAccount, useWatchContractEvent } from "wagmi";
import { decodeEventLog } from "viem";
import { useState } from "react";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

export default function TransactionHistory() {
  const { address, isConnected } = useAccount();
  const [logs, setLogs] = useState<{ type: string; message: string; timestamp: number }[]>([]);

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
                message: `Application created with priority ${priority}.`,
                timestamp: Number(timestamp) * 1000
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
                timestamp: Date.now()
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
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mt-8">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Transaction History
        </h2>
        <div className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/30">
          Event Log
        </div>
      </div>

      {!isConnected ? (
        <div className="p-5 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800/30">
          <p className="text-center text-red-600 dark:text-red-300 font-medium">
            Please connect your wallet to view transaction history.
          </p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-6 bg-gray-50 dark:bg-gray-700/30 rounded-lg text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            No transactions recorded yet.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            New transactions will appear here as they occur.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log, index) => (
            <div key={index} className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-2">
                <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  log.type === "Created" 
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800/30" 
                    : "bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-800/30"
                }`}>
                  {log.type}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 mt-1">{log.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
