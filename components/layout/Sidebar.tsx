"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import * as LucideIcons from "lucide-react";
import toolsData from "@/lib/tools-data";
import { useSidebarContext } from "@/components/SidebarContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  const getIcon = (iconName: string) => {
    // 类型安全的图标获取方法
    const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number; className?: string }>;
    return IconComponent ? (
      <IconComponent 
        size={isCollapsed ? 24 : 20} 
        className="transition-all duration-300" 
      />
    ) : null;
  };

  return (
    <aside 
      className={`bg-white border-r border-gray-200 h-[calc(100vh-4rem)] fixed left-0 top-16 hidden lg:block transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-24"
      }`}
    >
      <div className="p-2 relative h-full">
        {/* 折叠/展开按钮 */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-3 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-100 z-10 transition-all duration-200 hover:shadow-md"
          aria-label={isCollapsed ? "展开侧边栏" : "折叠侧边栏"}
          title={isCollapsed ? "展开" : "折叠"}
          tabIndex={0}
        >
          {isCollapsed 
            ? <LucideIcons.ChevronRight size={16} className="transition-transform duration-300" />
            : <LucideIcons.ChevronLeft size={16} className="transition-transform duration-300" />
          }
        </button>

        <h3 className={`text-xs font-medium text-gray-500 uppercase mb-4 text-center transition-opacity duration-300 ${
          isCollapsed ? "opacity-0 h-0 mb-0 overflow-hidden" : ""
        }`}>
          Tools
        </h3>
        
        <nav className="space-y-1">
          {toolsData.map((tool) => {
            const isActive = pathname === `/tools/${tool.id}`;
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className={`flex flex-col items-center justify-center py-3 px-1 rounded-md text-sm font-medium transition-all duration-300 ${
                  isCollapsed ? "py-4" : "py-3"
                } ${
                  isActive 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                aria-current={isActive ? "page" : undefined}
                tabIndex={0}
                title={tool.name}
              >
                <span className={`flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-500"}`}>
                  {getIcon(tool.iconName)}
                </span>
                <span className={`text-xs mt-1 text-center line-clamp-2 transition-all duration-300 ${
                  isCollapsed ? "opacity-0 h-0 mt-0 overflow-hidden" : ""
                }`}>
                  {tool.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
} 