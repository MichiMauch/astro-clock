"use client";
import { useEffect, useState } from "react";

interface IssData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

export default function IssData() {
  const [data, setData] = useState<IssData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/iss");
        if (!response.ok) {
          throw new Error("Failed to fetch ISS data");
        }
        const data = await response.json();
        setData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unbekannter Fehler");
        }
      }
    };

    fetchData();

    // Aktualisiere die Daten alle 3 Sekunden
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black font-white flex items-center justify-center z-50">
      <div className="bg-white shadow-md rounded p-6 max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">ISS Daten</h1>
        {error && <p className="text-red-500">{error}</p>}
        {data ? (
          <div>
            <p>
              <strong>Latitude:</strong> {data.latitude.toFixed(2)}
            </p>
            <p>
              <strong>Longitude:</strong> {data.longitude.toFixed(2)}
            </p>
            <p>
              <strong>Altitude:</strong> {data.altitude.toFixed(2)} km
            </p>
            <p>
              <strong>Velocity:</strong> {data.velocity.toFixed(2)} km/h
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
