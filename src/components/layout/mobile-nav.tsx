"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/navigation";

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-nav border-t border-border-nav">
      <div className="flex overflow-x-auto">
        {NAV_ITEMS.map((n) => {
          const isActive = pathname === n.href || (n.href === "/farm" && pathname === "/");
          return (
            <Link
              key={n.id}
              href={n.href}
              className="flex-1 min-w-[56px] flex flex-col items-center py-2 gap-0.5 relative"
            >
              <span className="text-sm" style={{ filter: isActive ? "none" : "grayscale(100%) opacity(0.5)" }}>
                {n.icon}
              </span>
              <span
                className="text-[8px] font-medium"
                style={{ color: isActive ? "#f1f5f9" : "#475569" }}
              >
                {n.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-2 right-2 h-0.5 bg-brand rounded-b-sm" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
