"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Zap,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "CRM Pipeline",
    href: "/crm",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart3,
    soon: true,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    soon: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  const sidebarContent = (
    <aside className="w-60 h-full bg-gray-950 flex flex-col">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-glow">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm tracking-tight leading-none">
              PropIntel
            </p>
            <p className="text-white/40 text-[10px] mt-0.5">Powered by Lightstone</p>
          </div>
        </div>
        {/* Close button – mobile only */}
        <button
          onClick={close}
          className="md:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-white/30 text-[10px] font-semibold uppercase tracking-widest px-3 pb-2 pt-1">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.soon ? "#" : item.href}
              onClick={() => close()}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-white/[0.10] text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]",
                item.soon && "cursor-default opacity-50"
              )}
            >
              <Icon
                size={16}
                className={isActive ? "text-accent-400" : "text-white/40 group-hover:text-white/60"}
              />
              <span className="flex-1">{item.label}</span>
              {item.soon && (
                <span className="text-[9px] font-semibold bg-white/10 text-white/40 px-1.5 py-0.5 rounded-md">
                  SOON
                </span>
              )}
              {isActive && (
                <ChevronRight size={12} className="text-white/30" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom user card */}
      <div className="mx-3 mb-4 p-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            AG
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">Alex Morgan</p>
            <p className="text-white/30 text-[10px] truncate">Senior Agent</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop sidebar – always visible on md+ */}
      <div className="hidden md:flex min-h-screen w-60 flex-shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile sidebar – slide-over */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={close}
          />
          {/* Drawer */}
          <div className="md:hidden fixed inset-y-0 left-0 z-50 flex">
            {sidebarContent}
          </div>
        </>
      )}
    </>
  );
}
