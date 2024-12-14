import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.MAPBOX_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "Mapbox access token not found" },
      { status: 500 }
    );
  }

  return NextResponse.json({ token });
}
