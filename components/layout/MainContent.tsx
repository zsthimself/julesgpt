"use client";

import { ReactNode } from "react";
import { useSidebarContext } from "@/components/SidebarContext";

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { isCollapsed } = useSidebarContext();

  return (
    <main className={`flex-1 pt-16 min-h-[calc(100vh-4rem-12rem)] transition-all duration-300 ${
      isCollapsed ? "lg:ml-16" : "lg:ml-24"
    }`}>
      <div className="container mx-auto p-6">
        {children}
      </div>
    </main>
  );
} 