// pages/api/nasa.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { command, quantities, center, start, stop } = req.query;

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
  console.log("Anfrage an NASA API:", nasaApiUrl); // Debugging-Informationen

  try {
    const response = await fetch(nasaApiUrl);
    const data = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*'); // CORS für die API
    res.setHeader('Access-Control-Allow-Methods', 'GET'); // HTTP-Methoden erlauben
    res.status(200).send(data);
  } catch (error) {
    console.error("Fehler beim Abrufen der NASA-Daten:", error);
    res.status(500).send('Fehler beim Abrufen der NASA-Daten');
  }
}
