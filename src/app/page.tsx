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
import Navbar from "@/components/Navbar";

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
    <div className="max-w-7xl mx-auto">
      {isConnected && isStudent ? (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg p-6 mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Student Visa Portal</h1>
            <p className="text-blue-100">Manage your visa application and documentation in one place</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <StudentVisaForm />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <VisaStatus />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <ApplicationDetails />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <DocumentUpload />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <BiometricVerification />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <UpgradePriority />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <TransactionHistory />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <FileUploadDocument />
            </div>
          </div>
        </div>
      ) : isConnected ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Welcome to the Student Visa System</h2>
          <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
            🚀 Your assigned roles: <span className="font-medium text-blue-600 dark:text-blue-400">{userRoles.join(", ")}</span>
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto"></div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Please connect your wallet to access the student visa application system.
            </p>
            <div className="inline-block p-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <div className="bg-white dark:bg-gray-800 rounded px-4 py-2">
                <p className="text-red-500 dark:text-red-400 font-medium">
                  Wallet connection required
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
