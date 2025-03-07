"use client";

import { useVisaApplications } from "@/hooks/useVisaApplications";
import { useWriteContract } from "wagmi";
import { STUDENT_VISA_CONTRACT } from "@/constants/contracts";

export default function UniversityDashboard() {
  const { applications, isLoading, error } = useVisaApplications();
  const { writeContract } = useWriteContract();

  console.log("Applications in UI:", applications); // ✅ Debugging

  const handleApprove = async (student: string) => {
    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "approveApplication",
        args: [student],
      });
      alert("✅ Approved!");
    } catch (err) {
      alert("❌ Error approving.");
      console.error(err);
    }
  };

  const handleReject = async (student: string) => {
    try {
      await writeContract({
        address: STUDENT_VISA_CONTRACT.address,
        abi: STUDENT_VISA_CONTRACT.abi,
        functionName: "rejectApplication",
        args: [student],
      });
      alert("❌ Rejected!");
    } catch (err) {
      alert("❌ Error rejecting.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl w-full p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">🏫 University Dashboard</h2>

      {isLoading ? (
        <p className="text-center text-blue-500">🔄 Loading applications...</p>
      ) : error ? (
        <p className="text-center text-red-500">❌ Error fetching applications</p>
      ) : applications && applications.length > 0 ? (
        <ul className="space-y-4">
          {applications.map((app, index) => (
            <li key={index} className="p-4 border rounded-lg bg-gray-50">
              <p className="text-lg"><strong>Student:</strong> {app.student}</p>
              <p><strong>University ID:</strong> {app.universityId}</p>
              <p><strong>Program ID:</strong> {app.programId}</p>
              <p><strong>Priority:</strong> {app.priority}</p>
              <p><strong>Status:</strong> {app.status === 0 ? "Pending" : app.status === 1 ? "Approved" : "Rejected"}</p>

              {app.status === 0 && (
                <div className="flex space-x-2 mt-2">
                  <button className="bg-green-500 text-white p-2 rounded-lg" onClick={() => handleApprove(app.student)}>
                    ✅ Approve
                  </button>
                  <button className="bg-red-500 text-white p-2 rounded-lg" onClick={() => handleReject(app.student)}>
                    ❌ Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No applications found.</p>
      )}
    </div>
  );
}
