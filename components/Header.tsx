"use client";

import { useState } from "react";
import { Search, Bell, RefreshCw } from "lucide-react";

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

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  }

  return (
    <header className="sticky top-0 z-30 bg-surface-elevated/80 backdrop-blur-md border-b border-gray-100/80 px-8 py-4 flex items-center gap-4">
      {/* Title */}
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Search */}
      {onSearch && (
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search properties…"
            value={searchValue}
            onChange={handleSearch}
            className="w-56 pl-8 pr-4 py-2 text-sm bg-gray-100 hover:bg-gray-150 focus:bg-white border border-transparent focus:border-gray-200 rounded-xl outline-none transition-all duration-150 text-gray-700 placeholder-gray-400"
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

      {/* Extra actions */}
      {actions}

      {/* Notifications */}
      <button className="relative p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
      </button>
    </header>
  );
}
