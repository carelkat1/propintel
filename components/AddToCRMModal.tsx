"use client";

import { useState } from "react";
import type { Property } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { getScoreColor } from "@/lib/predictionEngine";
import CriteriaTag from "./CriteriaTag";
import { X, Check, MapPin, User, Mail, Phone } from "lucide-react";

interface AddToCRMModalProps {
  property: Property;
  onConfirm: (agentName: string) => void;
  onClose: () => void;
}

const AGENTS = [
  "Alex Morgan",
  "Sam Patel",
  "Jordan Lee",
  "Chris Fourie",
];

export default function AddToCRMModal({
  property,
  onConfirm,
  onClose,
}: AddToCRMModalProps) {
  const [selectedAgent, setSelectedAgent] = useState(AGENTS[0]);
  const [loading, setLoading] = useState(false);
  const colors = getScoreColor(property.likelinessScore);

  async function handleConfirm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    onConfirm(selectedAgent);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Add to CRM</h2>
            <p className="text-sm text-gray-500 mt-0.5">Create a lead from this property</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Property summary */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {property.address}
              </p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin size={10} />
                {property.suburb}, {property.city}
              </p>
              <p className="text-base font-bold text-gray-900 mt-2">
                {formatCurrency(property.estimatedValue, true)}
              </p>
            </div>
            <div
              className={`text-sm font-bold px-3 py-1 rounded-full border ${colors.badge} ${colors.text}`}
            >
              {property.likelinessScore}%
            </div>
          </div>

          {/* Criteria */}
          <div className="flex flex-wrap gap-1 mt-3">
            {property.criteria.map((c) => (
              <CriteriaTag key={c} criterion={c} />
            ))}
          </div>
        </div>

        {/* Owner info */}
        <div className="px-6 py-4 border-b border-gray-100 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Owner Details
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User size={12} className="text-gray-400" />
              {property.ownerName}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Mail size={12} className="text-gray-400" />
              {property.ownerEmail}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Phone size={12} className="text-gray-400" />
              {property.ownerPhone}
            </div>
          </div>
        </div>

        {/* Assign agent */}
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Assign to Agent
          </p>
          <div className="grid grid-cols-2 gap-2">
            {AGENTS.map((agent) => (
              <button
                key={agent}
                onClick={() => setSelectedAgent(agent)}
                className={`text-sm px-3 py-2 rounded-xl border text-left transition-all ${
                  selectedAgent === agent
                    ? "border-accent-500 bg-accent-50 text-accent-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {agent}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={14} />
            )}
            {loading ? "Adding…" : "Add Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
