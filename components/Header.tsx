"use client";

import { useState } from "react";
import { Search, Bell, RefreshCw, Menu } from "lucide-react";
import { useSidebar } from "./SidebarContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  actions?: React.ReactNode;
}

export default function Header({
  title,
  subtitle,
  onSearch,
  onRefresh,
  refreshing,
  actions,
}: HeaderProps) {
  const [searchValue, setSearchValue] = useState("");
  const { toggle } = useSidebar();

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  }

  return (
    <header className="sticky top-0 z-30 bg-surface-elevated/80 backdrop-blur-md border-b border-gray-100/80 px-4 md:px-8 py-3 md:py-4 flex items-center gap-3">
      {/* Hamburger – mobile only */}
      <button
        onClick={toggle}
        className="md:hidden p-2 -ml-1 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors flex-shrink-0"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base md:text-xl font-semibold text-gray-900 tracking-tight truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs md:text-sm text-gray-400 mt-0.5 hidden sm:block truncate">
            {subtitle}
          </p>
        )}
      </div>

      {/* Search – hidden on xs, visible sm+ */}
      {onSearch && (
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search properties…"
            value={searchValue}
            onChange={handleSearch}
            className="w-44 md:w-56 pl-8 pr-4 py-2 text-sm bg-gray-100 hover:bg-gray-150 focus:bg-white border border-transparent focus:border-gray-200 rounded-xl outline-none transition-all duration-150 text-gray-700 placeholder-gray-400"
          />
        </div>
      )}

      {/* Refresh */}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Refresh data"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
        </button>
      )}

      {/* Extra actions – hide on xs */}
      <div className="hidden sm:flex">{actions}</div>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>
    </header>
  );
}
