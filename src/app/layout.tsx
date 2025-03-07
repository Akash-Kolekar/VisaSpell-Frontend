"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";
import Notifications from "@/components/Notifications";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Student Visa System</title>
      </head>
      <body className="bg-white text-gray-900 font-sans">
        <Providers>
          <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50">
              <Navbar />
            </header>
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="bg-gray-100 border-t py-4 text-center">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Student Visa System. All rights reserved.
              </p>
            </footer>
          </div>
          <Notifications />
        </Providers>
      </body>
    </html>
  );
}
