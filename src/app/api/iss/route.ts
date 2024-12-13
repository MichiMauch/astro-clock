import { NextResponse } from "next/server";

const ISS_API_URL = "https://api.wheretheiss.at/v1/satellites/25544";

export async function GET() {
  try {
    console.log("Abrufen der ISS-Daten von:", ISS_API_URL);
    const response = await fetch(ISS_API_URL);
    console.log("Externe API-Antwortstatus:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch ISS data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Erhaltene Daten:", data);

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Fehler beim Abrufen der ISS-Daten:", error);
    return NextResponse.json(
      { message: "Fehler beim Abrufen der ISS-Daten" },
      { status: 500 }
    );
  }
}

