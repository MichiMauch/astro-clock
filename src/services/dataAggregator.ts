export async function getCombinedAstronomyData(latitude: number = 47.3769, longitude: number = 8.5417) {
  // NASA-API-Logik
  async function fetchNasaData() {
    const currentDate = new Date();
    const defaultStart = currentDate.toISOString().split("T")[0];
    const defaultStop = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const fetchNasaEndpoint = async (command: string, quantities: string, center: string = "500@399") => {
      const query = new URLSearchParams({
        command,
        quantities,
        center,
        start: defaultStart,
        stop: defaultStop,
      });

      const nasaApiUrl = process.env.NODE_ENV === 'production'
        ? `https://astro-clock-lo0lpjqcl-michimauchs-projects.vercel.app/api/nasa?${query.toString()}`
        : `http://localhost:3000/api/nasa?${query.toString()}`;

      console.log("Anfrage an Proxy-Server:", nasaApiUrl); // Debugging-Informationen hinzufügen
      console.log("Frontend-Request an API-Route:", nasaApiUrl);

      const response = await fetch(nasaApiUrl, { method: "GET" });

      if (!response.ok) {
        throw new Error(`Fehler beim Abrufen der NASA-Daten: ${response.status}`);
      }

      const data = await response.text();
      console.log("NASA API Antwort:", data); // Debugging-Informationen hinzufügen
      return data;
    };

    try {
      const sunData = await fetchNasaEndpoint("10", "31");
      const moonData = await fetchNasaEndpoint("301", "31");
      const moonIlluminationData = await fetchNasaEndpoint("301", "10");
      const moonDistanceData = await fetchNasaEndpoint("301", "20");
      const sunDistanceData = await fetchNasaEndpoint("10", "20");
      const earthData = await fetchNasaEndpoint("399", "31", "500@10");

      const extractEphemerisData = (rawData: string) => {
        const startMarker = "$$SOE";
        const endMarker = "$$EOE";

        const startIndex = rawData.indexOf(startMarker);
        const endIndex = rawData.indexOf(endMarker);

        if (startIndex === -1 || endIndex === -1) return [];

        const ephemerisData = rawData.slice(startIndex + startMarker.length, endIndex).trim();

        return ephemerisData.split("\n").map((line) => {
          return line.trim().split(/\s+/);
        });
      };

      const parsedSunData = extractEphemerisData(sunData);
      const parsedMoonData = extractEphemerisData(moonData);
      const parsedMoonIlluminationData = extractEphemerisData(moonIlluminationData);
      const parsedMoonDistanceData = extractEphemerisData(moonDistanceData);
      const parsedSunDistanceData = extractEphemerisData(sunDistanceData);
      const parsedEarthData = extractEphemerisData(earthData);

      if (!parsedSunData[0] || !parsedMoonData[0] || !parsedMoonIlluminationData[0] || !parsedMoonDistanceData[0] || !parsedSunDistanceData[0] || !parsedEarthData[0]) {
        throw new Error("Unvollständige NASA-Daten erhalten");
      }

      return {
        sunEclipticLongitude: parseFloat(parsedSunData[0][2]),
        moonEclipticLongitude: parseFloat(parsedMoonData[0][2]),
        moonIllumination: parseFloat(parsedMoonIlluminationData[0][2]).toString(), // In String umwandeln
        moonDistance: parseFloat(parsedMoonDistanceData[0][2]),
        sunDistance: parseFloat(parsedSunDistanceData[0][2]),
        earthEclipticLongitude: parseFloat(parsedEarthData[0][2]),
      };
    } catch (error) {
      console.error("Fehler beim Abrufen der NASA-Daten:", error);
      return null;
    }
  }

  // IPGeolocation-API-Logik
  async function fetchIpGeolocationData() {
    const apiKey = process.env.IPGEOLOCATION_API_KEY;
    if (!apiKey) {
      throw new Error("IPGeolocation API-Schlüssel ist nicht gesetzt.");
    }
    const ipGeoApiUrl = `https://api.ipgeolocation.io/astronomy?apiKey=${apiKey}&location=zurich`;

    try {
      const response = await fetch(ipGeoApiUrl);

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Geolocation-Daten.");
      }

      const data = await response.json();

      return {
          moonDistance: data.moon_distance,
          sunDistance: data.sun_distance,
          moonPhase: data.moon_phase,
          date: data.date,
          currentTime: data.current_time,
          sunrise: data.sunrise,
          sunset: data.sunset,
          sunStatus: data.sun_status, // Hinzugefügt
          solarNoon: data.solar_noon, // Hinzugefügt
          dayLength: data.day_length, // Hinzugefügt
          moonrise: data.moonrise, // Hinzugefügt
          moonset: data.moonset, // Hinzugefügt
      };
    } catch (error) {
      console.error("Fehler beim Abrufen der Geolocation-Daten:", (error as Error).message);
      return null;
    }
  }

  // Nominatim-API-Logik
  async function fetchNominatimData(latitude: number, longitude: number) {
    console.log(`Nominatim API wird mit Koordinaten aufgerufen: Latitude: ${latitude}, Longitude: ${longitude}`);
    const nominatimApiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    try {
      const response = await fetch(nominatimApiUrl);

      if (!response.ok) {
        throw new Error("Fehler beim Abrufen der Nominatim-Daten.");
      }

      const data = await response.json();
      console.log("Nominatim-Daten erfolgreich abgerufen:", data);

      return {
        street: data.address.road,
        houseNumber: data.address.house_number,
        quarter: data.address.quarter || data.address.suburb || data.address.neighbourhood || data.address.county,
        postcode: data.address.postcode,
        city: data.address.town || data.address.city || data.address.village,
        country: data.address.country,
        boundingBox: data.boundingbox,
        state: data.address.state,  // Bundesland/Kanton
        countryCode: data.address.country_code, // ISO-Code des Landes
        additionalInfo: data.extratags, // Zusätzliche Infos wie Wikipedia-Links
        geometry: data.geojson, // Geometrie des Ortes (falls polygon_geojson=1)
        displayName: data.display_name, // Vollständige Adresse
        nameVariants: data.namedetails, // Alternative Namen
    };
    } catch (error) {
      console.error("Fehler beim Abrufen der Nominatim-Daten:", (error as Error).message);
      return null;
    }
  }

  // Astronomy API - Monddaten
async function fetchAstronomyMoonData(latitude: number, longitude: number, date: string) {
  const applicationId = process.env.ASTRONOMY_APP_ID;
  const applicationSecret = process.env.ASTRONOMY_APP_SECRET;

  if (!applicationId || !applicationSecret) {
    throw new Error("Astronomy API-Anmeldedaten fehlen.");
  }

  const astronomyApiUrl = `https://api.astronomyapi.com/api/v2/bodies/positions`;

  try {
    const response = await fetch(
      `${astronomyApiUrl}?latitude=${latitude}&longitude=${longitude}&elevation=0&from_date=${date}&to_date=${date}&time=00:00:00&output=table`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${btoa(`${applicationId}:${applicationSecret}`)}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Fehler beim Abrufen der Astronomy-API-Daten: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    // Filtere die Monddaten
    const moonData = data.data.table.rows.find((row: { entry: { id: string } }) => row.entry.id === "moon");

    if (!moonData || !moonData.cells || moonData.cells.length === 0) {
      throw new Error("Keine Monddaten gefunden.");
    }

    // Extrahiere relevante Informationen
    const moonPosition = moonData.cells[0]; // Nutze die erste Zelle des Tages
    return {
      moonAltitude: parseFloat(moonPosition.position.horizontal.altitude.degrees),
      moonAzimuth: parseFloat(moonPosition.position.horizontal.azimuth.degrees),
      moonDistanceAU: moonPosition.distance.fromEarth.au, // Distanz in AU
      moonDistanceKM: moonPosition.distance.fromEarth.km, // Distanz in Kilometer  
          
    };
  } catch (error) {
    console.error("Fehler beim Abrufen der Astronomy-API-Daten:", error);
    return null;
  }
}

  

  // Kombinierte Daten zurückgeben
  try {
    const [nasaData, ipGeoData, nominatimData, astronomyMoonData] = await Promise.all([
      fetchNasaData(),
      fetchIpGeolocationData(),
      fetchNominatimData(latitude, longitude),
      fetchAstronomyMoonData(latitude, longitude, new Date().toISOString().split("T")[0]),
    ]);

    if (!nasaData || !ipGeoData || !nominatimData || !astronomyMoonData) {
      throw new Error("Daten konnten nicht kombiniert werden.");
    }

    return { ...nasaData, ...ipGeoData, ...nominatimData, ...astronomyMoonData };
  } catch (error) {
    console.error("Fehler beim Abrufen der kombinierten Daten:", (error as Error).message);
    return null;
  }
  
}
