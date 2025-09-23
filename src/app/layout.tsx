import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/component/ClientLayoutWrapper";
import Providers from "./providers";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast"; // ✅ import Toaster

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dikshant IAS Coaching Center In India",
  description: "Dikshant IAS is one of the best IAS coaching centers in India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
          </Suspense>
          {/* ✅ Toaster mounted globally */}
            <Toaster position="top-center" reverseOrder={false} />

        </Providers>
      </body>
    </html>
  );
}
