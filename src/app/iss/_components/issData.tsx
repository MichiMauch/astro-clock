"use client";

import { useEffect, useState } from "react";
import {
  FaGlobeAmericas,
  FaRulerVertical,
  FaTachometerAlt,
} from "react-icons/fa";

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

export default function IssData({ className }: { className?: string }) {
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
    <div
      className={`flex flex-col justify-center items-center bg-black rounded-lg p-8 gap-8 ${className} lg:h-full`}
    >
      <div className="text-center text-gray-300">
        <h2 className="text-2xl font-bold mb-4 font-dmmono underline decoration-dotted">
          Internationale Space Station (ISS)
        </h2>
        <p>
          The ISS is a manned research laboratory in Earth&apos;s orbit and the
          largest artificial object in space.
        </p>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {data ? (
        <div className="text-center text-gray-300">
          <h3 className="text-2xl font-bold mb-4 font-dmmono underline decoration-dotted">
            Current Position of the ISS
          </h3>
          <ul className="space-y-2">
            <li>
              <FaGlobeAmericas className="inline-block mr-2" />
              <span className="font-dmmono text-xl">
                {data.latitude.toFixed(3)}°
              </span>
            </li>
            <li>
              <FaGlobeAmericas className="inline-block mr-2" />
              <span className="font-dmmono text-xl">
                {data.longitude.toFixed(3)}°
              </span>
            </li>
            <li>
              <FaRulerVertical className="inline-block mr-2" />
              <span className="font-dmmono text-xl">
                {Math.round(data.altitude)} km
              </span>
            </li>
            <li>
              <FaTachometerAlt className="inline-block mr-2" />
              <span className="font-dmmono text-xl">
                {Math.round(data.velocity)} km/h
              </span>
            </li>
          </ul>
          <p className="mt-4">
            The ISS orbits the Earth in approximately 90 - 93 minutes and offers
            unique opportunities for scientific research in microgravity. It is
            a symbol of international cooperation in space exploration.
          </p>
        </div>
      ) : (
        <p className="text-gray-300">Loading...</p>
      )}
    </div>
  );
}
