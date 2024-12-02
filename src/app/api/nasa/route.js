// src/app/api/nasa/route.js
import fetch from 'node-fetch';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const command = searchParams.get("command");
  const quantities = searchParams.get("quantities");
  const center = searchParams.get("center") || "500@399";
  const start = searchParams.get("start");
  const stop = searchParams.get("stop");

  const query = new URLSearchParams({
    format: 'text',
    COMMAND: `'${command}'`,
    OBJ_DATA: "'YES'",
    MAKE_EPHEM: "'YES'",
    EPHEM_TYPE: "'OBSERVER'",
    CENTER: `'${center}'`,
    START_TIME: `'${start}'`,
    STOP_TIME: `'${stop}'`,
    STEP_SIZE: "'1 d'",
    QUANTITIES: quantities,
  });

  const nasaApiUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?${query.toString()}`;
  console.log("Anfrage an NASA API:", nasaApiUrl);

  try {
    const response = await fetch(nasaApiUrl);
    const data = await response.text();

    return new Response(data, {
      headers: {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*', // Erlaube CORS
      },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der NASA-Daten:", error);
    return new Response('Fehler beim Abrufen der NASA-Daten', { status: 500 });
  }
}
