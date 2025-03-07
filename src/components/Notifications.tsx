"use client";

import { useAccount, useWatchContractEvent } from "wagmi";
import { toast } from "react-hot-toast";
import { decodeEventLog } from "viem";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

export default function Notifications() {
  const { address } = useAccount();

  // Listen for ApplicationCreated events and show a toast notification.
  useWatchContractEvent({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    eventName: "ApplicationCreated",
    onLogs: (logs) => {
      logs.forEach((log) => {
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
          if (address && applicant.toLowerCase() === address.toLowerCase()) {
            toast.success(
              `Application created at ${new Date(
                Number(timestamp) * 1000
              ).toLocaleTimeString()} with priority ${priority}`
            );
          }
        } catch (error) {
          console.error("Error decoding ApplicationCreated event:", error);
        }
      });
    },
  });

  // Listen for ApplicationStatusUpdated events and show a toast notification.
  useWatchContractEvent({
    address: STUDENT_VISA_CONTRACT.address,
    abi: STUDENT_VISA_CONTRACT.abi,
    eventName: "ApplicationStatusUpdated",
    onLogs: (logs) => {
      logs.forEach((log) => {
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
          if (address && applicant.toLowerCase() === address.toLowerCase()) {
            toast(`Application status updated to ${status}`);
          }
        } catch (error) {
          console.error("Error decoding ApplicationStatusUpdated event:", error);
        }
      });
    },
  });

  // You can add more event listeners here (e.g., for BiometricVerified, FeePaid, etc.)

  return null;
}
