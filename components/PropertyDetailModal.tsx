"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Property } from "@/types";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { getScoreColor, getScoreLabel } from "@/lib/predictionEngine";
import LikelinessRing from "./LikelinessRing";
import CriteriaTag from "./CriteriaTag";
import {
  X, MapPin, Bed, Bath, Car, Ruler, Home, Calendar,
  TrendingUp, User, Mail, Phone, Plus, ChevronRight,
  Building2, Landmark, AlertCircle, Info,
} from "lucide-react";

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  onAddToCrm: (property: Property) => void;
}

export default function PropertyDetailModal({ property, onClose, onAddToCrm }: PropertyDetailModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const colors = getScoreColor(property.likelinessScore);
  const label = getScoreLabel(property.likelinessScore);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const valueGap = property.estimatedValue - property.municipalValuation;
  const valueGapPct = property.municipalValuation > 0
    ? Math.round((valueGap / property.municipalValuation) * 100)
    : 0;
  const capitalGain = property.estimatedValue - property.lastSalePrice;
  const capitalGainPct = property.lastSalePrice > 0
    ? Math.round((capitalGain / property.lastSalePrice) * 100)
    : 0;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative bg-white w-full sm:max-w-2xl lg:max-w-3xl max-h-[92vh] sm:max-h-[88vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-scale-in overflow-hidden">

        {/* Hero image */}
        <div className="relative h-48 sm:h-56 flex-shrink-0">
          <Image src={property.imageUrl} alt={property.address} fill className="object-cover" sizes="(max-width:768px) 100vw, 672px" />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors">
            <X size={16} />
          </button>
          {/* Score badge */}
          <div className="absolute top-4 left-4">
            <span className={`text-xs font-bold px-3 py-1.5 rounded-full border backdrop-blur-sm ${colors.badge} ${colors.text}`} style={{ background: "rgba(255,255,255,0.90)" }}>
              {label}
            </span>
          </div>
          {/* Address overlay */}
          <div className="absolute bottom-4 left-4 right-16">
            <p className="text-white font-bold text-lg leading-snug drop-shadow-lg">{property.address}</p>
            <p className="text-white/80 text-sm flex items-center gap-1 mt-0.5">
              <MapPin size={11} />{property.suburb}, {property.city} · {property.propertyType}
            </p>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* Score + quick stats strip */}
          <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100 bg-gray-50/50">
            <LikelinessRing score={property.likelinessScore} size="lg" showLabel />
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                { icon: Car, label: "Garages", value: property.garages },
                { icon: Ruler, label: "Erf Size", value: `${property.erfSize.toLocaleString()} m²` },
              ].map(({ icon: Icon, label: l, value }) => (
                <div key={l} className="bg-white rounded-xl px-3 py-2 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
                    <Icon size={11} />
                    <span className="text-[10px] font-medium uppercase tracking-wide">{l}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 py-4 space-y-5">

            {/* ── WHY LIKELY TO SELL ── */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-7 h-7 rounded-lg ${colors.badge} flex items-center justify-center`}>
                  <AlertCircle size={14} className={colors.text} />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Why This Property Is Flagged</h2>
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full border ${colors.badge} ${colors.text}`}>
                  {property.likelinessScore}% match
                </span>
              </div>

              {property.criteriaDetails && property.criteriaDetails.length > 0 ? (
                <div className="space-y-3">
                  {property.criteriaDetails.map((detail, i) => {
                    // Weight bar percentage relative to max weight (32)
                    const barPct = Math.round((detail.weight / 32) * 100);
                    return (
                      <div key={detail.name} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                              {i + 1}
                            </span>
                            <CriteriaTag criterion={detail.name} />
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${barPct}%` }} />
                            </div>
                            <span className={`text-[10px] font-bold ${colors.text}`}>+{detail.weight}pts</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">{detail.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <Info size={14} />
                    No specific signals triggered — general market monitoring.
                  </p>
                </div>
              )}
            </section>

            {/* ── VALUATION ANALYSIS ── */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Landmark size={14} className="text-gray-400" />
                Valuation Analysis
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">AVM Estimate</p>
                  <p className="text-xl font-bold text-gray-900 mt-1 tracking-tight">{formatCurrency(property.estimatedValue, true)}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Lightstone automated valuation</p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Municipal Value</p>
                  <p className="text-xl font-bold text-gray-900 mt-1 tracking-tight">{formatCurrency(property.municipalValuation, true)}</p>
                  <p className={`text-[11px] mt-0.5 font-medium ${valueGapPct > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {valueGapPct > 0 ? `+${valueGapPct}%` : `${valueGapPct}%`} vs AVM
                  </p>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Capital Gain</p>
                  <p className={`text-xl font-bold mt-1 tracking-tight ${capitalGain >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {capitalGain >= 0 ? "+" : ""}{formatCurrency(capitalGain, true)}
                  </p>
                  <p className={`text-[11px] mt-0.5 font-medium ${capitalGainPct >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {capitalGainPct >= 0 ? "+" : ""}{capitalGainPct}% since purchase
                  </p>
                </div>
              </div>
            </section>

            {/* ── PROPERTY DETAILS ── */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Building2 size={14} className="text-gray-400" />
                Property Details
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {[
                  ["Type", property.propertyType],
                  ["Floor Size", `${property.floorSize.toLocaleString()} m²`],
                  ["Erf Size", `${property.erfSize.toLocaleString()} m²`],
                  ["Last Sale Price", formatCurrency(property.lastSalePrice)],
                  ["Last Transfer Date", formatDate(property.lastSaleDate)],
                  ["Years Owned", `${property.yearsOwned} year${property.yearsOwned !== 1 ? "s" : ""}`],
                  ["Neighbourhood Velocity", `${property.neighborhoodSalesVelocity} tx/yr within 500m`],
                  ["Postal Code", property.postalCode],
                ].map(([key, val], i, arr) => (
                  <div key={key} className={`flex items-center justify-between px-4 py-3 ${i < arr.length - 1 ? "border-b border-gray-50" : ""}`}>
                    <span className="text-xs text-gray-500">{key}</span>
                    <span className="text-xs font-semibold text-gray-900">{val}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* ── OWNER DETAILS ── */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                Registered Owner
              </h2>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {getInitials(property.ownerName)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{property.ownerName}</p>
                    <p className="text-xs text-gray-500">Age {property.ownerAge} · Owned {property.yearsOwned}y</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <a href={`mailto:${property.ownerEmail}`} className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-accent-600 transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Mail size={13} className="text-blue-500" />
                    </div>
                    <span className="group-hover:underline truncate">{property.ownerEmail}</span>
                  </a>
                  <a href={`tel:${property.ownerPhone}`} className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-accent-600 transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                      <Phone size={13} className="text-green-500" />
                    </div>
                    <span className="group-hover:underline">{property.ownerPhone}</span>
                  </a>
                </div>
              </div>
            </section>

            {/* ── MARKET CONTEXT ── */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <TrendingUp size={14} className="text-gray-400" />
                Neighbourhood Context
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Area Sales Velocity</p>
                  <p className="text-2xl font-bold text-gray-900">{property.neighborhoodSalesVelocity}</p>
                  <p className="text-[11px] text-gray-400">transactions/year within 500m</p>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-accent-500 rounded-full" style={{ width: `${Math.min((property.neighborhoodSalesVelocity / 15) * 100, 100)}%` }} />
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide mb-1">Data Signals Active</p>
                  <p className="text-2xl font-bold text-gray-900">{property.criteriaDetails?.length ?? property.criteria.length}</p>
                  <p className="text-[11px] text-gray-400">of 14 possible sell signals</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Array.from({ length: 14 }, (_, i) => (
                      <div key={i} className={`w-3 h-3 rounded-sm ${i < (property.criteriaDetails?.length ?? property.criteria.length) ? colors.bg : "bg-gray-100"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="h-2" />
          </div>
        </div>

        {/* Sticky footer CTA */}
        <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 py-4 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 truncate">{property.address}, {property.suburb}</p>
            <p className="text-base font-bold text-gray-900 tracking-tight">{formatCurrency(property.estimatedValue, true)}</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => { onAddToCrm(property); onClose(); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus size={14} />
            Add to CRM
          </button>
        </div>
      </div>
    </div>
  );
}
