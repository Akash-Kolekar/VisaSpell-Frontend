"use client";

import { useAccount } from "wagmi";
import ApplicationDetails from "./ApplicationDetails";

export default function Profile() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return (
      <p className="text-center text-red-500">
        Please connect your wallet to view your profile.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
      <h2 className="text-3xl font-bold text-center mb-4">Profile</h2>
      <p className="text-center mb-4">Wallet: {address}</p>
      {/* Show additional details, for now we re-use ApplicationDetails */}
      <ApplicationDetails />
    </div>
  );
}
