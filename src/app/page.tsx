"use client";

import WalletConnect from "@/components/WalletConnect";
import StudentVisaForm from "@/components/StudentVisaForm";
import VisaStatus from "@/components/VisaStatus";
import ApplicationDetails from "@/components/ApplicationDetails";
import TransactionHistory from "@/components/TransactionHistory";
import DocumentUpload from "@/components/DocumentUpload";
import BiometricVerification from "@/components/BiometricVerification";
import UpgradePriority from "@/components/UpgradePriority";
import FileUploadDocument from "@/components/FileUploadDocument";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ROLES, getUserRoles } from "@/constants/roles";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      setUserRoles(getUserRoles(address));
    }
  }, [address, isConnected]);

  const isStudent = userRoles.includes(ROLES.STUDENT);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <WalletConnect />
      {isConnected && isStudent ? (
        <>
          <StudentVisaForm />
          <VisaStatus />
          <ApplicationDetails />
          <TransactionHistory />
          <DocumentUpload />
          <BiometricVerification />
          <UpgradePriority />
          <FileUploadDocument />
        </>
      ) : isConnected ? (
        <p className="text-lg mt-6">
          🚀 Welcome! Your assigned roles: {userRoles.join(", ")}.
        </p>
      ) : null}
    </main>
  );
}
