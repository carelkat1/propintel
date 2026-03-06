"use client";

import { useEffect, useState, useMemo } from "react";
import type {
  Property,
  PropertiesResponse,
  ViewMode,
  FilterRange,
  SortKey,
} from "@/types";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import FilterBar from "@/components/FilterBar";
import PropertyCard from "@/components/PropertyCard";
import AddToCRMModal from "@/components/AddToCRMModal";
import PropertyDetailModal from "@/components/PropertyDetailModal";
import { RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [data, setData] = useState<PropertiesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filter, setFilter] = useState<FilterRange>("all");
  const [sortKey, setSortKey] = useState<SortKey>("likelinessScore");
  const [searchQuery, setSearchQuery] = useState("");
  const [crmModal, setCrmModal] = useState<Property | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  async function fetchData(showRefreshing = false) {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch("/api/properties");
      const json: PropertiesResponse = await res.json();
      setData(json);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = [...data.properties];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.address.toLowerCase().includes(q) ||
          p.suburb.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.ownerName.toLowerCase().includes(q)
      );
    }

    // Score filter
    if (filter === "high") list = list.filter((p) => p.likelinessScore >= 70);
    if (filter === "medium") list = list.filter((p) => p.likelinessScore >= 45 && p.likelinessScore < 70);
    if (filter === "low") list = list.filter((p) => p.likelinessScore < 45);

    // Sort
    list.sort((a, b) => {
      if (sortKey === "likelinessScore") return b.likelinessScore - a.likelinessScore;
      if (sortKey === "estimatedValue") return b.estimatedValue - a.estimatedValue;
      if (sortKey === "yearsOwned") return b.yearsOwned - a.yearsOwned;
      return 0;
    });

    return list;
  }, [data, searchQuery, filter, sortKey]);

  async function handleAddToCrm(property: Property, agentName: string) {
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId: property.id,
        ownerName: property.ownerName,
        ownerEmail: property.ownerEmail,
        ownerPhone: property.ownerPhone,
        address: property.address,
        suburb: property.suburb,
        estimatedValue: property.estimatedValue,
        likelinessScore: property.likelinessScore,
        criteria: property.criteria,
        status: "Identified",
        assignedAgent: agentName,
      }),
    });

    setCrmModal(null);
    showToast(`${property.ownerName} added to CRM`);
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-gray-200 border-t-accent-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Analysing properties…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="Property Intelligence"
        subtitle="Predictive seller identification powered by Lightstone"
        onSearch={setSearchQuery}
        onRefresh={() => fetchData(true)}
        refreshing={refreshing}
        actions={
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live data
          </div>
        }
      />

      {data && <StatsBar data={data} />}

      {data && (
        <FilterBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filter={filter}
          onFilterChange={setFilter}
          sortKey={sortKey}
          onSortChange={setSortKey}
          totalShown={filtered.length}
          totalAll={data.total}
        />
      )}

      {/* Property grid / list */}
      <div className="px-4 md:px-8 pb-8 flex-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <RefreshCw size={24} className="text-gray-400" />
            </div>
            <p className="text-base font-semibold text-gray-700">No properties found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode="grid"
                onSelect={(p) => setSelectedProperty(p)}
                onAddTocrm={(p) => setCrmModal(p)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                viewMode="list"
                onSelect={(p) => setSelectedProperty(p)}
                onAddTocrm={(p) => setCrmModal(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Property detail drill-down modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onAddTocrm={(p) => {
            setSelectedProperty(null);
            setCrmModal(p);
          }}
        />
      )}

      {/* Add to CRM modal */}
      {crmModal && (
        <AddToCRMModal
          property={crmModal}
          onConfirm={(agent) => handleAddToCrm(crmModal, agent)}
          onClose={() => setCrmModal(null)}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
