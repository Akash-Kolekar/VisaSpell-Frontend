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
    <nav className="bg-blue-600">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo / Title */}
        <div className="flex items-center">
          <Link href="/">
            <span className="text-white text-3xl font-bold">SVS</span>
          </Link>
          <div className="ml-8 flex space-x-6">
            <Link href="/">
              <span className="text-white hover:text-blue-200 cursor-pointer">
                Home
              </span>
            </Link>
            {userRoles.includes(ROLES.UNIVERSITY) && (
              <Link href="/university">
                <span className="text-white hover:text-blue-200 cursor-pointer">
                  University
                </span>
              </Link>
            )}
            {userRoles.includes(ROLES.EMBASSY) && (
              <Link href="/embassy">
                <span className="text-white hover:text-blue-200 cursor-pointer">
                  Embassy
                </span>
              </Link>
            )}
            {userRoles.includes(ROLES.ADMIN) && (
              <Link href="/admin">
                <span className="text-white hover:text-blue-200 cursor-pointer">
                  Admin
                </span>
              </Link>
            )}
            {userRoles.includes(ROLES.VERIFIER) && (
              <Link href="/verifier">
                <span className="text-white hover:text-blue-200 cursor-pointer">
                  Verifier
                </span>
              </Link>
            )}
            <Link href="/profile">
              <span className="text-white hover:text-blue-200 cursor-pointer">
                Profile
              </span>
            </Link>
          </div>
        </div>
        {/* Wallet Connect Button */}
        <div>
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </nav>
  );
}
