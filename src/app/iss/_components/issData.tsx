"use client";

import { useEffect, useState } from "react";

interface IssData {
  name: string;
  id: number;
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  visibility: string;
  footprint: number;
  timestamp: number;
  daynum: number;
  solar_lat: number;
  solar_lon: number;
  units: string;
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
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black font-white flex items-center justify-center z-50">
      <div className="bg-white shadow-md rounded p-6 max-w-md text-center">
        <h1 className="text-xl font-bold mb-4">ISS Daten</h1>
        {error && <p className="text-red-500">{error}</p>}
        {data ? (
          <div>
            <ul className="text-left">
              {Object.entries(data).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}
