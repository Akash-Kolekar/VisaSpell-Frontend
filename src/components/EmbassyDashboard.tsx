"use client";

import { useVisaApplications } from "@/hooks/useVisaApplications";
import { useWriteContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

export default function EmbassyDashboard() {
  const { applications, isLoading, error } = useVisaApplications();
  const { writeContract } = useWriteContract();

  console.log("Applications in UI:", applications); // ✅ Debugging

  const handleApproveVisa = async (student: string) => {
    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "approveVisa",
        args: [student],
      });
      alert("🛂 Visa Approved!");
    } catch (err) {
      alert("❌ Error approving visa.");
      console.error(err);
    }
  };

  const handleRejectVisa = async (student: string) => {
    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "rejectVisa",
        args: [student],
      });
      alert("⛔ Visa Rejected!");
    } catch (err) {
      alert("❌ Error rejecting visa.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl w-full p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">🛂 Embassy Dashboard</h2>

      {isLoading ? (
        <p className="text-center text-blue-500">🔄 Loading applications...</p>
      ) : error ? (
        <p className="text-center text-red-500">❌ Error fetching applications</p>
      ) : applications && applications.length > 0 ? (
        <ul className="space-y-4">
          {applications.map((app, index) =>
            app.status === 1 ? (
              <li key={index} className="p-4 border rounded-lg bg-gray-50">
                <p><strong>Student:</strong> {app.student}</p>
                <p><strong>Priority:</strong> {app.priority}</p>

                <div className="flex space-x-2 mt-2">
                  <button className="bg-green-500 text-white p-2 rounded-lg" onClick={() => handleApproveVisa(app.student)}>
                    ✅ Approve Visa
                  </button>
                  <button className="bg-red-500 text-white p-2 rounded-lg" onClick={() => handleRejectVisa(app.student)}>
                    ❌ Reject Visa
                  </button>
                </div>
              </li>
            ) : null
          )}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No applications available.</p>
      )}
    </div>
  );
}
