"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { getUserRoles } from "@/constants/roles";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      setUserRoles(getUserRoles(address));
    }
  }, [address, isConnected]);

  return (
    <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-all">
      <ConnectButton />
      {isConnected && (
        <div className="mt-5 text-sm font-medium bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 py-3 px-5 rounded-lg text-indigo-700 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/30">
          <span className="text-gray-500 dark:text-gray-400 mr-2">Roles:</span>
          {userRoles.length > 0 ? userRoles.join(", ") : "No roles assigned"}
        </div>
      )}
    </div>
  );
}
