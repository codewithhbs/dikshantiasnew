import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/component/ClientLayoutWrapper";
import Providers from "./providers";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast"; // ✅ import Toaster
import Script from "next/script";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dikshant IAS Coaching Center In India",
  description: "Dikshant IAS is one of the best IAS coaching centers in India",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>

      <head>
        <meta name="google-site-verification" content="c7FgyR8QTNRAU7VO6riBBz8M8JYhKXKQa11Q8Bn5CN4" />
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-ZB3WCMNJ4D"></Script>
      <Script id="google-analytics">
      {`  window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'G-ZB3WCMNJ4D');`}
      </Script>

      </head>
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
