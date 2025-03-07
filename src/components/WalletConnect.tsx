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
    <div className="flex flex-col items-center space-y-4 p-4">
      <ConnectButton />
      {isConnected && (
        <div className="mt-4 text-lg font-semibold">
          Role: {userRoles.length > 0 ? userRoles.join(", ") : "No roles assigned"}
        </div>
      )}
    </div>
  );
}
