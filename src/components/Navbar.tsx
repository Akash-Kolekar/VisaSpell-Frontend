"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { getUserRoles, ROLES } from "@/constants/roles";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    if (isConnected && address) {
      setUserRoles(getUserRoles(address));
    }
  }, [address, isConnected]);

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      <div className="text-white text-lg font-bold">Student Visa System</div>
      <div className="space-x-4">
        <Link href="/" className="text-white hover:underline">
          Home
        </Link>
        {userRoles.includes(ROLES.UNIVERSITY) && (
          <Link href="/university" className="text-white hover:underline">
            University
          </Link>
        )}
        {userRoles.includes(ROLES.EMBASSY) && (
          <Link href="/embassy" className="text-white hover:underline">
            Embassy
          </Link>
        )}
        {userRoles.includes(ROLES.ADMIN) && (
          <Link href="/admin" className="text-white hover:underline">
            Admin
          </Link>
        )}
        {userRoles.includes(ROLES.VERIFIER) && (
          <Link href="/verifier" className="text-white hover:underline">
            Verifier
          </Link>
        )}
        <Link href="/profile" className="text-white hover:underline">
          Profile
        </Link>
      </div>
      <ConnectButton />
    </nav>
  );
}
