import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { NASA_API_KEY } = process.env;

  if (!NASA_API_KEY) {
    return NextResponse.json({ error: "NASA API Key not configured" }, { status: 500 });
  }

  const url = new URL(request.url);
  const date = url.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date parameter is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${NASA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching EPIC data: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching EPIC data:", error);
    return NextResponse.json({ error: "Failed to fetch EPIC data" }, { status: 500 });
  }
}
