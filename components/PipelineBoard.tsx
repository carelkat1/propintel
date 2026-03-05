"use client";

import type { Lead, LeadStatus } from "@/types";
import { formatCurrency, getInitials } from "@/lib/utils";
import { getScoreColor } from "@/lib/predictionEngine";

const COLUMNS: { status: LeadStatus; color: string; dot: string }[] = [
  { status: "Identified", color: "border-t-gray-400", dot: "bg-gray-400" },
  { status: "Outreach Sent", color: "border-t-blue-500", dot: "bg-blue-500" },
  { status: "Meeting Set", color: "border-t-amber-500", dot: "bg-amber-500" },
  { status: "Signed", color: "border-t-emerald-500", dot: "bg-emerald-500" },
];

interface PipelineBoardProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
}

export default function PipelineBoard({ leads, onLeadClick }: PipelineBoardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-8 py-6">
      {COLUMNS.map(({ status, color, dot }) => {
        const columnLeads = leads.filter((l) => l.status === status);
        const totalValue = columnLeads.reduce((s, l) => s + l.estimatedValue, 0);

        return (
          <div key={status} className="flex flex-col gap-3">
            {/* Column header */}
            <div className={`bg-white rounded-xl border-t-2 ${color} border-x border-b border-gray-100 px-4 py-3 shadow-sm`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className="text-sm font-semibold text-gray-800">{status}</span>
                </div>
                <span className="text-xs font-medium bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                  {columnLeads.length}
                </span>
              </div>
              {columnLeads.length > 0 && (
                <p className="text-[11px] text-gray-400 mt-1">
                  {formatCurrency(totalValue, true)} pipeline
                </p>
              )}
            </div>

            {/* Cards */}
            <div className="space-y-2.5">
              {columnLeads.map((lead) => {
                const scoreColor = getScoreColor(lead.likelinessScore);
                return (
                  <div
                    key={lead.id}
                    onClick={() => onLeadClick(lead)}
                    className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-card hover:shadow-card-hover p-4 cursor-pointer transition-all duration-200 group"
                  >
                    {/* Owner */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {getInitials(lead.ownerName)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {lead.ownerName}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate">{lead.suburb}</p>
                      </div>
                    </div>

                    {/* Value + score */}
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-gray-900 tracking-tight">
                        {formatCurrency(lead.estimatedValue, true)}
                      </p>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor.badge} ${scoreColor.text}`}
                      >
                        {lead.likelinessScore}%
                      </span>
                    </div>

                    {/* Agent */}
                    <p className="text-[11px] text-gray-400 mt-2">
                      {lead.assignedAgent.split(" ")[0]} ·{" "}
                      {lead.notes.length} note{lead.notes.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}

              {columnLeads.length === 0 && (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl py-8 text-center">
                  <p className="text-xs text-gray-400">No leads</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
