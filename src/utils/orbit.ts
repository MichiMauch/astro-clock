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
