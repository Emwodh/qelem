import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import NavigationProgress from "@/components/ui/NavigationProgress";
import { Auth0Provider } from "@auth0/nextjs-auth0/client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Qelem — Ethiopian Matric & University Entrance Exam Preparation (Grades 9–12)",
  description:
    "A studio-crafted revision platform for Ethiopian Grade 12 students. Master four years of national curriculum, practice verified past entrance questions, and simulate real exam pacing.",
  keywords: [
    "Ethiopian Matric Exam",
    "Grade 12 Entrance Exam",
    "Ethiopian University Entrance Examination",
    "Grade 9-12 Ethiopian Curriculum",
    "Natural Science Matric Past Papers",
    "Social Science Matric Past Papers",
    "Qelem Prep",
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Qelem",
  },
};

export const viewport = {
  themeColor: "#FAFAFA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-[#FAFAFA] text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white min-h-screen flex flex-col`}
      >
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <Auth0Provider>{children}</Auth0Provider>
      </body>
    </html>
  );
}
