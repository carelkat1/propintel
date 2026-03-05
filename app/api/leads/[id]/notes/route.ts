import { NextRequest, NextResponse } from "next/server";
import { addNoteToLead } from "@/lib/crmStore";
import type { NoteType } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { type, content, agent } = body as {
      type: NoteType;
      content: string;
      agent: string;
    };

    const lead = addNoteToLead(params.id, { type, content, agent });
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Note POST error:", error);
    return NextResponse.json({ error: "Failed to add note" }, { status: 500 });
  }
}
