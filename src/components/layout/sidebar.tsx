"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden lg:flex w-[68px] min-h-screen bg-bg-nav border-r border-border-nav flex-col items-center pt-3.5 gap-0.5 sticky top-0 flex-shrink-0 z-50 overflow-y-auto">
        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-lg font-extrabold text-white mb-3.5 font-heading">
          P
        </div>
        {NAV_ITEMS.map((n) => {
          const isActive = pathname === n.href || (n.href === "/farm" && pathname === "/");
          return (
            <Link
              key={n.id}
              href={n.href}
              title={n.label}
              className="relative w-[52px] py-1.5 px-0.5 rounded-lg flex flex-col items-center gap-0.5 transition-all"
              style={{ background: isActive ? "#141c2e" : "transparent" }}
            >
              <span className="text-[15px]" style={{ filter: isActive ? "none" : "grayscale(100%) opacity(0.5)" }}>{n.icon}</span>
              <span className="text-[8px]" style={{ color: isActive ? "#f1f5f9" : "#475569", fontWeight: isActive ? 700 : 400 }}>{n.label}</span>
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-brand rounded-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tablet sidebar (collapsed) */}
      <nav className="hidden md:flex lg:hidden w-12 min-h-screen bg-bg-nav border-r border-border-nav flex-col items-center pt-3 gap-0.5 sticky top-0 flex-shrink-0 z-50 overflow-y-auto">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center text-sm font-extrabold text-white mb-3 font-heading">
          P
        </div>
        {NAV_ITEMS.map((n) => {
          const isActive = pathname === n.href || (n.href === "/farm" && pathname === "/");
          return (
            <Link
              key={n.id}
              href={n.href}
              title={n.label}
              className="relative w-10 py-1.5 rounded-md flex flex-col items-center transition-all"
              style={{ background: isActive ? "#141c2e" : "transparent" }}
            >
              <span className="text-sm" style={{ filter: isActive ? "none" : "grayscale(100%) opacity(0.5)" }}>{n.icon}</span>
              {isActive && (
                <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-brand rounded-sm" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
