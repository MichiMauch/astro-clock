import * as satellite from "satellite.js";

export function calculateOrbit(tleLines: string[]): { latitude: number; longitude: number }[] {
  const satrec = satellite.twoline2satrec(tleLines[0].trim(), tleLines[1].trim());
  const now = new Date();
  const positions = [];

  for (let i = 0; i < 120; i++) { // Berechne für 120 Minuten (2 Stunden) (Schrittweite: 1 Minute)
    const time = new Date(now.getTime() + i * 60000); // 1 Minute in Millisekunden
    const positionAndVelocity = satellite.propagate(satrec, time);
    const gmst = satellite.gstime(time);

    if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
      const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
      const latitude = satellite.degreesLat(position.latitude);
      const longitude = satellite.degreesLong(position.longitude);

      positions.push({ latitude, longitude });
    }
  }

  return positions;
}

export async function calculateNextPass(latitude: number, longitude: number): Promise<Date | null> {
  const tleLines = await fetchTleData();
  if (!tleLines) {
    throw new Error("Fehler beim Abrufen der TLE-Daten.");
  }

  const satrec = satellite.twoline2satrec(tleLines[0].trim(), tleLines[1].trim());
  const now = new Date();

  for (let i = 0; i < 1440; i++) { // Berechne für 24 Stunden (Schrittweite: 1 Minute)
    const time = new Date(now.getTime() + i * 60000); // 1 Minute in Millisekunden
    const positionAndVelocity = satellite.propagate(satrec, time);
    const gmst = satellite.gstime(time);

    if (positionAndVelocity.position && typeof positionAndVelocity.position !== 'boolean') {
      const position = satellite.eciToGeodetic(positionAndVelocity.position, gmst);
      const satLatitude = satellite.degreesLat(position.latitude);
      const satLongitude = satellite.degreesLong(position.longitude);

      if (Math.abs(satLatitude - latitude) < 1 && Math.abs(satLongitude - longitude) < 1) {
        return time;
      }
    }
  }

  return null;
}

async function fetchTleData(): Promise<string[] | null> {
  try {
    const response = await fetch("/api/tle?satelliteNumber=25544");
    if (!response.ok) {
      throw new Error("Failed to fetch TLE data");
    }
    const tleData = await response.json();
    return [tleData.line1, tleData.line2];
  } catch (error) {
    console.error("Error fetching TLE data:", error);
    return null;
  }
}
