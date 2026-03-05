"use client";

import type { FilterRange, SortKey, ViewMode } from "@/types";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  filter: FilterRange;
  onFilterChange: (f: FilterRange) => void;
  sortKey: SortKey;
  onSortChange: (s: SortKey) => void;
  totalShown: number;
  totalAll: number;
}

const FILTERS: { label: string; value: FilterRange; dot: string }[] = [
  { label: "All", value: "all", dot: "bg-gray-400" },
  { label: "High (70%+)", value: "high", dot: "bg-red-500" },
  { label: "Medium (45–69%)", value: "medium", dot: "bg-orange-500" },
  { label: "Watch List (<45%)", value: "low", dot: "bg-emerald-500" },
];

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: "Likeliness Score", value: "likelinessScore" },
  { label: "Property Value", value: "estimatedValue" },
  { label: "Years Owned", value: "yearsOwned" },
];

export default function FilterBar({
  viewMode,
  onViewModeChange,
  filter,
  onFilterChange,
  sortKey,
  onSortChange,
  totalShown,
  totalAll,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 px-8 pb-4">
      {/* Filter pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <SlidersHorizontal size={13} className="text-gray-400 mr-0.5" />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all border",
              filter === f.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:text-gray-800"
            )}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${f.dot}`} />
            {f.label}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Results count */}
      <span className="text-xs text-gray-400">
        {totalShown} of {totalAll} properties
      </span>

      {/* Sort */}
      <select
        value={sortKey}
        onChange={(e) => onSortChange(e.target.value as SortKey)}
        className="text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-1.5 outline-none hover:border-gray-300 cursor-pointer"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            Sort: {o.label}
          </option>
        ))}
      </select>

      {/* View toggle */}
      <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
        <button
          onClick={() => onViewModeChange("grid")}
          className={cn(
            "p-1.5 rounded-lg transition-all",
            viewMode === "grid"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-400 hover:text-gray-700"
          )}
        >
          <LayoutGrid size={14} />
        </button>
        <button
          onClick={() => onViewModeChange("list")}
          className={cn(
            "p-1.5 rounded-lg transition-all",
            viewMode === "list"
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-400 hover:text-gray-700"
          )}
        >
          <List size={14} />
        </button>
      </div>
    </div>
  );
}
