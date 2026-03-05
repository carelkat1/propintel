import { NextRequest, NextResponse } from "next/server";
import { getAllLeads, createLead, getPipelineSummary } from "@/lib/crmStore";
import type { Lead, LeadsResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const leads = getAllLeads();
    const pipeline = getPipelineSummary();

    const response: LeadsResponse = {
      leads,
      total: leads.length,
      pipeline,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Leads GET error:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lead = createLead(body as Omit<Lead, "id" | "notes" | "createdAt" | "updatedAt">);
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Leads POST error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
