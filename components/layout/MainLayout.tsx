"use client";

import { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import MainContent from "./MainContent";
import { SidebarProvider } from "../SidebarContext";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex flex-grow">
          <Sidebar />
          <MainContent>{children}</MainContent>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
} 