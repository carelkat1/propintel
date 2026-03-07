"use client";

import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/data/navigation";

export default function Topbar() {
  const pathname = usePathname();
  const currentPage = NAV_ITEMS.find((n) => n.href === pathname || (n.href === "/farm" && pathname === "/"));

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-xl border-b border-border-nav px-4 md:px-6 py-3 flex items-center gap-3.5">
      <div className="font-heading text-xl font-extrabold tracking-tight">
        Prop<span className="text-brand">Scout</span>
      </div>
      <span className="text-border-hover hidden sm:inline">|</span>
      <span className="text-text-muted text-sm hidden sm:inline">{currentPage?.label || "Farm"}</span>
      <div className="flex-1" />
      <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded border border-brand/30 bg-brand/10 text-brand">
        v3.0
      </span>
    </header>
  );
}
