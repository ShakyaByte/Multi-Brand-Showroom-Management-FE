import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Bike,
  Tag,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={20} />,
    path: "/admin/dashboard",
  },
  {
    id: "users",
    label: "Users",
    icon: <Users size={20} />,
    path: "/admin/users",
  },
  {
    id: "roles",
    label: "Roles",
    icon: <ShieldCheck size={20} />,
    path: "/admin/roles",
  },
  {
    id: "bikes",
    label: "Bikes",
    icon: <Bike size={20} />,
    path: "/admin/bikes",
  },
  {
    id: "brands",
    label: "Brands",
    icon: <Tag size={20} />,
    path: "/admin/brands",
  },
  {
    id: "showroom",
    label: "Showroom",
    icon: <Store size={20} />,
    path: "/admin/showroom",
  },
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-white transition-all duration-300 border-r border-gray-200 z-50 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 h-20">
          {!isCollapsed && (
            <span className="text-xl font-bold text-blue-600">Multi Brand</span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center p-3 rounded-xl transition-all ${
                isActive(item.path)
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-600 hover:bg-gray-50"
              } ${isCollapsed ? "justify-center" : "gap-3"}`}
            >
              <span className={isActive(item.path) ? "text-blue-600" : "text-gray-500"}>
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
              {isActive(item.path) && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </nav>

        {/* Footer info or profile could go here */}
        <div className="p-4 border-t border-gray-100">
           {/* Add user profile summary if needed */}
        </div>
      </div>
    </aside>
  );
}
