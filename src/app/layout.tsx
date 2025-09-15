import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayoutWrapper from "@/component/ClientLayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",  
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dikshant IAS Coaching Center In India",
  description: "Dikshant IAS is the one of the best ias coaching center in India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
  <head>
    {/* Google Translate Script */}
    <script
      type="text/javascript"
      src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
    ></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `
        function googleTranslateElementInit() {
          new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi',
            autoDisplay: false
          }, 'google_translate_element');
        }
      `,
      }}
    />
    {/* Hide Google Translate Top Bar */}
    <style dangerouslySetInnerHTML={{ __html: `
      iframe.skiptranslate { display: none !important; }
      body { top: 0 !important; }
    `}} />
  </head>
  <body>
    {/* Hidden Google Translate container */}
    <div id="google_translate_element" className="hidden"></div>
    <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
  </body>
</html>

  );
}
