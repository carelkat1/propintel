"use client";

import { useState } from "react";
import Image from "next/image";
import type { Property } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getScoreColor, getScoreLabel } from "@/lib/predictionEngine";
import LikelinessRing from "./LikelinessRing";
import CriteriaTag from "./CriteriaTag";
import {
  Bed,
  Bath,
  Car,
  MapPin,
  Calendar,
  Plus,
  ChevronRight,
} from "lucide-react";

interface PropertyCardProps {
  property: Property;
  viewMode: "grid" | "list";
  onAddTocrm?: (property: Property) => void;
}

export default function PropertyCard({
  property,
  viewMode,
  onAddTocrm,
}: PropertyCardProps) {
  const [hovered, setHovered] = useState(false);
  const colors = getScoreColor(property.likelinessScore);
  const label = getScoreLabel(property.likelinessScore);

  if (viewMode === "list") {
    return (
      <div
        className="group flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-gray-100 hover:border-gray-200 shadow-card hover:shadow-card-hover transition-all duration-200 cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Thumbnail */}
        <div className="relative w-20 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={property.imageUrl}
            alt={property.address}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        {/* Address & location */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">
            {property.address}
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <MapPin size={10} />
            {property.suburb}, {property.city}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            {property.criteria.slice(0, 3).map((c) => (
              <CriteriaTag key={c} criterion={c} />
            ))}
          </div>
        </div>

        {/* Specs */}
        <div className="hidden md:flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Bed size={12} /> {property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath size={12} /> {property.bathrooms}
          </span>
          <span className="flex items-center gap-1">
            <Car size={12} /> {property.garages}
          </span>
        </div>

        {/* Value */}
        <div className="hidden lg:block text-right">
          <p className="font-semibold text-gray-900 text-sm">
            {formatCurrency(property.estimatedValue, true)}
          </p>
          <p className="text-xs text-gray-400">{property.propertyType}</p>
        </div>

        {/* Ring */}
        <div className="flex-shrink-0">
          <LikelinessRing score={property.likelinessScore} size="sm" />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {onAddTocrm && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddTocrm(property);
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-accent-500 hover:text-accent-600 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <Plus size={12} />
              CRM
            </button>
          )}
          <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-card hover:shadow-card-hover overflow-hidden transition-all duration-300 flex flex-col cursor-pointer"
      style={{ transform: hovered ? "translateY(-2px)" : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.address}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Score badge overlay */}
        <div className="absolute top-3 right-3">
          <div
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm ${colors.badge} ${colors.text}`}
            style={{ background: "rgba(255,255,255,0.88)" }}
          >
            {label}
          </div>
        </div>
        {/* Property type */}
        <div className="absolute bottom-3 left-3">
          <span className="text-[10px] font-medium bg-black/50 text-white backdrop-blur-sm px-2 py-1 rounded-full">
            {property.propertyType}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Address row */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm leading-snug truncate">
              {property.address}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin size={10} />
              {property.suburb}, {property.city}
            </p>
          </div>
          <LikelinessRing score={property.likelinessScore} size="sm" />
        </div>

        {/* Specs */}
        <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
          <span className="flex items-center gap-1">
            <Bed size={11} className="text-gray-400" />
            {property.bedrooms} bed
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1">
            <Bath size={11} className="text-gray-400" />
            {property.bathrooms} bath
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span className="flex items-center gap-1">
            <Car size={11} className="text-gray-400" />
            {property.garages}
          </span>
          <span className="w-px h-3 bg-gray-200" />
          <span>{property.erfSize.toLocaleString()} m²</span>
        </div>

        {/* Criteria tags */}
        <div className="flex flex-wrap gap-1">
          {property.criteria.map((c) => (
            <CriteriaTag key={c} criterion={c} />
          ))}
        </div>

        {/* Value & owner */}
        <div className="flex items-center justify-between pt-1 mt-auto border-t border-gray-50">
          <div>
            <p className="font-bold text-gray-900 text-base tracking-tight">
              {formatCurrency(property.estimatedValue, true)}
            </p>
            <p className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar size={10} />
              {property.yearsOwned}y owned · {property.ownerName.split(" ")[0]}
            </p>
          </div>

          {onAddTocrm && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddTocrm(property);
              }}
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-accent-500 hover:bg-accent-600 px-3 py-1.5 rounded-xl transition-all duration-150 shadow-sm hover:shadow-glow"
            >
              <Plus size={12} />
              Add to CRM
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
