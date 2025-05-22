"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

// 创建上下文
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// 创建提供器组件
export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // 从localStorage读取初始状态
  useEffect(() => {
    setMounted(true);
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    // 保存状态到localStorage
    if (mounted) {
      localStorage.setItem('sidebarCollapsed', String(newState));
    }
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

// 自定义hook，用于在组件中访问上下文
export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarProvider');
  }
  return context;
} 