import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const satelliteNumber = new URL(request.url).searchParams.get("satelliteNumber");

  if (!satelliteNumber) {
    return NextResponse.json(
      { message: "Satellitennummer fehlt in der Anfrage." },
      { status: 400 }
    );
  }

  const TLE_API_URL = `https://celestrak.org/NORAD/elements/gp.php?CATNR=${satelliteNumber}`;

  try {
    const response = await fetch(TLE_API_URL);

    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen der TLE-Daten: ${response.statusText}`);
    }

    const data = await response.text(); // TLE-Daten als Text empfangen
    console.log("Empfangene TLE-Daten:", data);

    // Zeilen extrahieren und trimmen
    const tleLines = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    console.log("Gefilterte TLE-Zeilen:", tleLines);

    // Überprüfe, ob mindestens 2 Zeilen vorhanden sind
    if (tleLines.length < 2) {
      throw new Error("Ungültige TLE-Daten: Weniger als 2 Zeilen vorhanden.");
    }

    // Rückgabe der ersten beiden Zeilen
    return NextResponse.json({
      line1: tleLines[0],
      line2: tleLines[1],
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der TLE-Daten:", error);
    return NextResponse.json(
      { message: "Fehler beim Abrufen der TLE-Daten" },
      { status: 500 }
    );
  }
}
