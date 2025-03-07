// src/hooks/useVisaApplications.ts
import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

// Dummy implementation for testing
export function useVisaApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // For now, let's simulate data fetching with dummy data:
  useEffect(() => {
    try {
      const dummyData = [
        {
          student: "0xStudentAddress1",
          universityId: "U1",
          programId: "P1",
          priority: 0,
          status: 0, // 0: Pending, 1: Approved, 2: Rejected
        },
        {
          student: "0xStudentAddress2",
          universityId: "U2",
          programId: "P2",
          priority: 1,
          status: 1,
        },
      ];
      console.log("Dummy visa applications:", dummyData);
      setApplications(dummyData);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  }, []);

  return { applications, isLoading, error };
}
