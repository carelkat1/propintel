/**
 * In-memory CRM store (server-side singleton).
 *
 * In production, replace with a Postgres / Supabase / PlanetScale
 * database layer using Prisma or Drizzle ORM.
 */

import type { Lead, LeadStatus, Note, NoteType } from "@/types";
import { getLightstoneProperties } from "./lightstoneService";

// ─── Seed Leads from top properties ──────────────────────────────────────────

const AGENTS = ["Alex Morgan", "Sam Patel", "Jordan Lee", "Chris Fourie"];
const STATUSES: LeadStatus[] = ["Identified", "Outreach Sent", "Meeting Set", "Signed"];

function seedNotes(count: number, index: number): Note[] {
  const noteTypes: NoteType[] = ["email", "call", "message", "meeting"];
  const contents: Record<NoteType, string[]> = {
    email: [
      "Sent initial introduction email with market report attached.",
      "Follow-up email sent — no response yet.",
      "Replied to owner enquiry about valuation.",
    ],
    call: [
      "Short call — owner not ready to discuss. Will follow up in 2 weeks.",
      "Spoke for 15 minutes. Owner is considering options.",
      "Owner confirmed interest in a free valuation.",
    ],
    message: [
      "WhatsApp message sent with neighbourhood CMA summary.",
      "SMS follow-up after missed call.",
    ],
    meeting: [
      "In-person meeting at property. Owner showed keen interest.",
      "Virtual meeting scheduled for next Thursday.",
    ],
  };

  return Array.from({ length: count }, (_, i) => {
    const type = noteTypes[(index + i) % noteTypes.length];
    const options = contents[type];
    return {
      id: `note-${index}-${i}`,
      type,
      content: options[(index + i) % options.length],
      timestamp: new Date(Date.now() - (count - i) * 2 * 24 * 60 * 60 * 1000).toISOString(),
      agent: AGENTS[index % AGENTS.length],
    };
  });
}

function buildInitialLeads(): Lead[] {
  const props = getLightstoneProperties().slice(0, 20);

  return props.map((p, i) => {
    const statusIndex = Math.min(
      Math.floor(p.likelinessScore / 26),
      STATUSES.length - 1
    );
    const noteCount = i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1;
    const now = new Date();
    const createdAt = new Date(now.getTime() - (20 - i) * 3 * 24 * 60 * 60 * 1000).toISOString();

    return {
      id: `lead-${i.toString().padStart(3, "0")}`,
      propertyId: p.id,
      ownerName: p.ownerName,
      ownerEmail: p.ownerEmail,
      ownerPhone: p.ownerPhone,
      address: `${p.address}, ${p.suburb}`,
      suburb: p.suburb,
      estimatedValue: p.estimatedValue,
      likelinessScore: p.likelinessScore,
      criteria: p.criteria,
      status: STATUSES[statusIndex],
      notes: seedNotes(noteCount, i),
      assignedAgent: AGENTS[i % AGENTS.length],
      createdAt,
      updatedAt: createdAt,
    };
  });
}

// ─── Singleton Store ──────────────────────────────────────────────────────────

let _leads: Lead[] | null = null;

function getLeads(): Lead[] {
  if (!_leads) _leads = buildInitialLeads();
  return _leads;
}

// ─── CRUD Operations ──────────────────────────────────────────────────────────

export function getAllLeads(): Lead[] {
  return getLeads();
}

export function getLeadById(id: string): Lead | undefined {
  return getLeads().find((l) => l.id === id);
}

export function createLead(data: Omit<Lead, "id" | "notes" | "createdAt" | "updatedAt">): Lead {
  const leads = getLeads();
  const id = `lead-${String(leads.length).padStart(3, "0")}`;
  const now = new Date().toISOString();
  const newLead: Lead = { ...data, id, notes: [], createdAt: now, updatedAt: now };
  leads.push(newLead);
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus): Lead | null {
  const lead = getLeads().find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  return lead;
}

export function addNoteToLead(
  id: string,
  note: Omit<Note, "id" | "timestamp">
): Lead | null {
  const lead = getLeads().find((l) => l.id === id);
  if (!lead) return null;
  const newNote: Note = {
    ...note,
    id: `note-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  lead.notes.push(newNote);
  lead.updatedAt = new Date().toISOString();
  return lead;
}

export function getPipelineSummary(): Record<LeadStatus, number> {
  const leads = getLeads();
  return {
    Identified: leads.filter((l) => l.status === "Identified").length,
    "Outreach Sent": leads.filter((l) => l.status === "Outreach Sent").length,
    "Meeting Set": leads.filter((l) => l.status === "Meeting Set").length,
    Signed: leads.filter((l) => l.status === "Signed").length,
  };
}
