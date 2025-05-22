import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import StagewiseProvider from "@/components/StagewiseProvider";
import { ClerkProvider } from "@clerk/nextjs";
import UserDataSync from "@/components/UserDataSync";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JulesGPT - AI Content Detection and Analysis Tools",
  description: "Detect AI-generated content with high accuracy. Featuring OpenAI and Gemini detection, plagiarism checking, and more tools trusted by millions.",
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <MainLayout>
            {children}
          </MainLayout>
          <StagewiseProvider />
          <UserDataSync />
        </body>
      </html>
    </ClerkProvider>
  );
}
