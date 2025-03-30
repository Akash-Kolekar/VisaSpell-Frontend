"use client";

import Profile from "@/components/Profile";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
        <p className="text-purple-100">Manage your personal information and settings</p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <Profile />
      </div>
    </div>
  );
}
