import { useState, useEffect } from "react";
import { readContract } from "wagmi/actions";
import { STUDENT_VISA_CONTRACT, APPLICATION_ADDRESSES } from "@/constants/contracts";

export function useVisaApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const results = await Promise.all(
          APPLICATION_ADDRESSES.map((applicantAddress) =>
            readContract(
              ({
                address: STUDENT_VISA_CONTRACT.address,
                abi: STUDENT_VISA_CONTRACT.abi,
                functionName: "getApplicationDetails",
                args: [applicantAddress],
              } as unknown) as Parameters<typeof readContract>[0],
              {} as any
            )
          )
        );

        const data = APPLICATION_ADDRESSES.map((addr, idx) => {
          // Assuming getApplicationDetails returns a tuple:
          // [status, credibilityScore, createdAt, updatedAt, timeline]
          const [status, credibilityScore, createdAt, updatedAt, timeline] = results[idx] as [
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
          return {
            student: addr,
            status,
            credibilityScore,
            createdAt,
            updatedAt,
            timeline,
          };
        });

        setApplications(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError(err);
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

  return { applications, isLoading, error };
}
