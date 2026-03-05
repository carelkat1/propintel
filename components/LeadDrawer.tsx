"use client";

import { useState } from "react";
import type { Lead, LeadStatus, NoteType } from "@/types";
import { formatCurrency, formatRelativeTime, formatDate, getInitials } from "@/lib/utils";
import { getScoreColor } from "@/lib/predictionEngine";
import CriteriaTag from "./CriteriaTag";
import LikelinessRing from "./LikelinessRing";
import {
  X,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  Send,
  MapPin,
  DollarSign,
} from "lucide-react";

const STATUS_OPTIONS: LeadStatus[] = [
  "Identified",
  "Outreach Sent",
  "Meeting Set",
  "Signed",
];

const STATUS_COLORS: Record<LeadStatus, string> = {
  Identified: "bg-gray-100 text-gray-700 border-gray-200",
  "Outreach Sent": "bg-blue-50 text-blue-700 border-blue-200",
  "Meeting Set": "bg-amber-50 text-amber-700 border-amber-200",
  Signed: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const NOTE_TYPE_META: Record<NoteType, { icon: React.ReactNode; label: string; color: string }> = {
  email: { icon: <Mail size={11} />, label: "Email", color: "bg-blue-50 text-blue-600" },
  call: { icon: <Phone size={11} />, label: "Call", color: "bg-green-50 text-green-600" },
  message: { icon: <MessageSquare size={11} />, label: "Message", color: "bg-purple-50 text-purple-600" },
  meeting: { icon: <Calendar size={11} />, label: "Meeting", color: "bg-amber-50 text-amber-600" },
};

interface LeadDrawerProps {
  lead: Lead;
  onClose: () => void;
  onStatusChange: (leadId: string, status: LeadStatus) => void;
  onAddNote: (leadId: string, type: NoteType, content: string) => void;
}

export default function LeadDrawer({
  lead,
  onClose,
  onStatusChange,
  onAddNote,
}: LeadDrawerProps) {
  const [noteType, setNoteType] = useState<NoteType>("call");
  const [noteContent, setNoteContent] = useState("");
  const [saving, setSaving] = useState(false);
  const colors = getScoreColor(lead.likelinessScore);

  async function handleAddNote() {
    if (!noteContent.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    onAddNote(lead.id, noteType, noteContent.trim());
    setNoteContent("");
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col h-full animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {getInitials(lead.ownerName)}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{lead.ownerName}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin size={10} />
                {lead.address}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Score + value */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-4">
            <LikelinessRing score={lead.likelinessScore} size="md" showLabel />
            <div>
              <p className="text-xs text-gray-500">Estimated Value</p>
              <p className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-1">
                <DollarSign size={14} className="text-gray-400" />
                {formatCurrency(lead.estimatedValue, true)}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">
                Added {formatDate(lead.createdAt)}
              </p>
            </div>
          </div>

          {/* Criteria */}
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Sell Signals
            </p>
            <div className="flex flex-wrap gap-1.5">
              {lead.criteria.map((c) => (
                <CriteriaTag key={c} criterion={c} />
              ))}
            </div>
          </div>

          {/* Status pipeline */}
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Pipeline Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(lead.id, status)}
                  className={`text-xs font-medium px-3 py-2 rounded-xl border text-left transition-all ${
                    lead.status === status
                      ? STATUS_COLORS[status] + " ring-1 ring-offset-1 ring-current"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="px-6 py-4 border-b border-gray-100 space-y-2.5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Contact
            </p>
            <a
              href={`mailto:${lead.ownerEmail}`}
              className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-accent-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                <Mail size={13} className="text-blue-500" />
              </div>
              {lead.ownerEmail}
            </a>
            <a
              href={`tel:${lead.ownerPhone}`}
              className="flex items-center gap-2.5 text-sm text-gray-700 hover:text-accent-600 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-green-50 flex items-center justify-center">
                <Phone size={13} className="text-green-500" />
              </div>
              {lead.ownerPhone}
            </a>
          </div>

          {/* Notes timeline */}
          <div className="px-6 py-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Activity ({lead.notes.length})
            </p>

            {lead.notes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-6">
                No activity yet. Log the first interaction below.
              </p>
            ) : (
              <div className="space-y-3">
                {[...lead.notes].reverse().map((note) => {
                  const meta = NOTE_TYPE_META[note.type];
                  return (
                    <div key={note.id} className="flex gap-3">
                      <div
                        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${meta.color}`}
                      >
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-gray-700">
                            {meta.label} · {note.agent.split(" ")[0]}
                          </span>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">
                            {formatRelativeTime(note.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {note.content}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Add note footer */}
        <div className="border-t border-gray-100 px-6 py-4 bg-gray-50">
          {/* Note type selector */}
          <div className="flex gap-1.5 mb-3">
            {(Object.keys(NOTE_TYPE_META) as NoteType[]).map((type) => {
              const meta = NOTE_TYPE_META[type];
              return (
                <button
                  key={type}
                  onClick={() => setNoteType(type)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    noteType === type
                      ? `${meta.color} border-current`
                      : "border-transparent text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {meta.icon}
                  {meta.label}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote();
              }}
              placeholder={`Log a ${noteType}…`}
              rows={2}
              className="flex-1 text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-accent-400 resize-none placeholder-gray-400 text-gray-700 transition-colors"
            />
            <button
              onClick={handleAddNote}
              disabled={saving || !noteContent.trim()}
              className="px-4 py-2 rounded-xl bg-accent-500 hover:bg-accent-600 text-white transition-colors disabled:opacity-40 self-end flex items-center gap-1.5 text-sm font-medium"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={13} />
              )}
            </button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">⌘ + Enter to save</p>
        </div>
      </div>
    </div>
  );
}
