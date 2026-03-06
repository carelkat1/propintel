"use client";

import { useEffect, useState, useMemo } from "react";
import type { Lead, LeadStatus, LeadsResponse, NoteType } from "@/types";
import Header from "@/components/Header";
import PipelineBoard from "@/components/PipelineBoard";
import LeadDrawer from "@/components/LeadDrawer";
import { formatCurrency, getInitials } from "@/lib/utils";
import { getScoreColor } from "@/lib/predictionEngine";
import CriteriaTag from "@/components/CriteriaTag";
import {
  Kanban,
  TableProperties,
  TrendingUp,
  Users,
  Handshake,
  PenLine,
} from "lucide-react";

type CRMView = "board" | "table";

export default function CRMPage() {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [crmView, setCrmView] = useState<CRMView>("board");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchLeads() {
    const res = await fetch("/api/leads");
    const json: LeadsResponse = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function handleStatusChange(leadId: string, status: LeadStatus) {
    const res = await fetch(`/api/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated: Lead = await res.json();

    setData((prev) => {
      if (!prev) return prev;
      const leads = prev.leads.map((l) => (l.id === leadId ? updated : l));
      return {
        ...prev,
        leads,
        pipeline: {
          Identified: leads.filter((l) => l.status === "Identified").length,
          "Outreach Sent": leads.filter((l) => l.status === "Outreach Sent").length,
          "Meeting Set": leads.filter((l) => l.status === "Meeting Set").length,
          Signed: leads.filter((l) => l.status === "Signed").length,
        },
      };
    });

    setSelectedLead(updated);
  }

  async function handleAddNote(leadId: string, type: NoteType, content: string) {
    const res = await fetch(`/api/leads/${leadId}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, content, agent: "Alex Morgan" }),
    });
    const updated: Lead = await res.json();

    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        leads: prev.leads.map((l) => (l.id === leadId ? updated : l)),
      };
    });

    setSelectedLead(updated);
  }

  const filtered = useMemo(() => {
    if (!data) return [];
    if (!searchQuery.trim()) return data.leads;
    const q = searchQuery.toLowerCase();
    return data.leads.filter(
      (l) =>
        l.ownerName.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.suburb.toLowerCase().includes(q) ||
        l.assignedAgent.toLowerCase().includes(q)
    );
  }, [data, searchQuery]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-gray-200 border-t-accent-500 rounded-full animate-spin" />
      </div>
    );
  }

  const pipeline = data?.pipeline;

  const summaryStats = [
    {
      label: "Total Leads",
      value: data?.total ?? 0,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "In Outreach",
      value: pipeline?.["Outreach Sent"] ?? 0,
      icon: PenLine,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Meetings Set",
      value: pipeline?.["Meeting Set"] ?? 0,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Mandates Signed",
      value: pipeline?.["Signed"] ?? 0,
      icon: Handshake,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Header
        title="CRM Pipeline"
        subtitle="Manage your seller outreach and mandate pipeline"
        onSearch={setSearchQuery}
        actions={
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-0.5">
            <button
              onClick={() => setCrmView("board")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                crmView === "board"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Kanban size={13} />
              Board
            </button>
            <button
              onClick={() => setCrmView("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                crmView === "table"
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <TableProperties size={13} />
              Table
            </button>
          </div>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 px-4 md:px-8 py-4 md:py-6">
        {summaryStats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-4 flex items-center gap-3"
            >
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={s.color} />
              </div>
              <div>
                <p className="text-[11px] text-gray-500 font-medium leading-none">
                  {s.label}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1 tracking-tight">
                  {s.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Board / Table */}
      {crmView === "board" ? (
        <PipelineBoard
          leads={filtered}
          onLeadClick={setSelectedLead}
        />
      ) : (
        <div className="px-4 md:px-8 pb-8 flex-1 overflow-auto">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Owner", "Property", "Value", "Score", "Status", "Agent", "Notes"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => {
                  const scoreColor = getScoreColor(lead.likelinessScore);
                  const STATUS_DOT: Record<LeadStatus, string> = {
                    Identified: "bg-gray-400",
                    "Outreach Sent": "bg-blue-500",
                    "Meeting Set": "bg-amber-500",
                    Signed: "bg-emerald-500",
                  };

                  return (
                    <tr
                      key={lead.id}
                      className={`border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition-colors ${
                        i % 2 === 0 ? "" : "bg-gray-50/30"
                      }`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      {/* Owner */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                            {getInitials(lead.ownerName)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-xs truncate">
                              {lead.ownerName}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate">
                              {lead.ownerEmail}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Property */}
                      <td className="px-4 py-3 max-w-[180px]">
                        <p className="text-xs text-gray-700 font-medium truncate">
                          {lead.address}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lead.criteria.slice(0, 2).map((c) => (
                            <CriteriaTag key={c} criterion={c} />
                          ))}
                        </div>
                      </td>

                      {/* Value */}
                      <td className="px-4 py-3">
                        <p className="text-xs font-semibold text-gray-900">
                          {formatCurrency(lead.estimatedValue, true)}
                        </p>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor.badge} ${scoreColor.text}`}
                        >
                          {lead.likelinessScore}%
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1.5 text-xs text-gray-700">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[lead.status]}`}
                          />
                          {lead.status}
                        </span>
                      </td>

                      {/* Agent */}
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-600">
                          {lead.assignedAgent.split(" ")[0]}
                        </p>
                      </td>

                      {/* Notes */}
                      <td className="px-4 py-3">
                        <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                          {lead.notes.length}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lead drawer */}
      {selectedLead && (
        <LeadDrawer
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
          onAddNote={handleAddNote}
        />
      )}
    </div>
  );
}
