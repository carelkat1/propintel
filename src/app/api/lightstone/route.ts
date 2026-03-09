import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const path = req.nextUrl.searchParams.get('path');
    if (!path) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }

    const apiKey = process.env.LIGHTSTONE_API_KEY || req.headers.get('x-lightstone-key') || '';

    const response = await fetch(`https://apis.lightstone.co.za${path}`, {
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 204) {
      return NextResponse.json(null, { status: 204 });
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Lightstone API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
