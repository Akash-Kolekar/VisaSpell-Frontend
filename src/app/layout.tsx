// src/app/layout.tsx
import "@rainbow-me/rainbowkit/styles.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="p-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
