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
    <nav className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo / Title */}
        <div className="flex items-center">
          <Link href="/">
            <span className="text-white text-2xl font-bold tracking-tight hover:opacity-90 transition-opacity">
              SVS
            </span>
          </Link>
          <div className="ml-10 hidden md:flex space-x-8">
            <Link href="/">
              <span className="text-white font-medium hover:text-blue-100 transition-colors duration-200 cursor-pointer text-sm tracking-wide">
                Home
              </span>
            </Link>
            {userRoles.includes(ROLES.UNIVERSITY) && (
              <Link href="/university">
                <span className="text-white font-medium hover:text-blue-100 transition-colors duration-200 cursor-pointer text-sm tracking-wide">
                  University
                </span>
              </Link>
            )}
            {userRoles.includes(ROLES.EMBASSY) && (
              <Link href="/embassy">
                <span className="text-white font-medium hover:text-blue-100 transition-colors duration-200 cursor-pointer text-sm tracking-wide">
                  Embassy
                </span>
              </Link>
            )}
            {userRoles.includes(ROLES.ADMIN) && (
              <Link href="/admin">
                <span className="text-white font-medium hover:text-blue-100 transition-colors duration-200 cursor-pointer text-sm tracking-wide">
                  Admin
                </span>
              </Link>
            )}
            {userRoles.includes(ROLES.VERIFIER) && (
              <Link href="/verifier">
                <span className="text-white font-medium hover:text-blue-100 transition-colors duration-200 cursor-pointer text-sm tracking-wide">
                  Verifier
                </span>
              </Link>
            )}
            <Link href="/profile">
              <span className="text-white font-medium hover:text-blue-100 transition-colors duration-200 cursor-pointer text-sm tracking-wide">
                Profile
              </span>
            </Link>
          </div>
        </div>
        {/* Wallet Connect Button */}
        <div className="flex items-center">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </nav>
  );
}
