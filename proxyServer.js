import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors()); // CORS für alle Routen aktivieren

app.get('/api/nasa', async (req, res) => {
  const { command, quantities, center, start, stop } = req.query;
  const query = new URLSearchParams({
    command,
    quantities,
    center,
    start,
    stop,
  });

  const nasaApiUrl = `https://ssd.jpl.nasa.gov/api/horizons.api?${query.toString()}`;
  console.log("Anfrage an NASA API:", nasaApiUrl); // Debugging-Informationen hinzufügen

  try {
    const response = await fetch(nasaApiUrl);
    const data = await response.text();
    console.log("NASA API Antwort durch Proxy:", data); // Debugging-Informationen hinzufügen
    res.send(data);
  } catch (error) {
    console.error("Fehler beim Abrufen der NASA-Daten durch Proxy:", error);
    res.status(500).send('Fehler beim Abrufen der NASA-Daten');
  }
});

app.listen(port, () => {
  console.log(`Proxy-Server läuft auf http://localhost:${port}`);
});