import { NextResponse } from "next/server";
import { getLightstoneProperties } from "@/lib/lightstoneService";
import type { PropertiesResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const properties = getLightstoneProperties(48);

    const highConfidence = properties.filter((p) => p.likelinessScore >= 70).length;
    const moderate = properties.filter((p) => p.likelinessScore >= 45 && p.likelinessScore < 70).length;
    const watchList = properties.filter((p) => p.likelinessScore < 45).length;
    const averageScore =
      properties.length > 0
        ? Math.round(
            properties.reduce((sum, p) => sum + p.likelinessScore, 0) /
              properties.length
          )
        : 0;

    const response: PropertiesResponse = {
      properties,
      total: properties.length,
      highConfidence,
      moderate,
      watchList,
      averageScore,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Properties API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}
