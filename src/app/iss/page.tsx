"use client";

import IssDataProvider, { IssContext } from "./_components/issDataProvider";
import { useContext, useEffect, useState } from "react";

export default function HomePage() {
  return (
    <IssDataProvider>
      <div className="relative z-10 min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Startseite</h1>
        <p className="mb-6">Hier kannst du die ISS-Daten sehen:</p>
        <IssMapWrapper />
      </div>
    </IssDataProvider>
  );
}

function IssMapWrapper() {
  const { data, orbitPath } = useContext(IssContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("ISS data:", data);
    console.log("Orbit path:", orbitPath);

    if (data && orbitPath.length > 0) {
      setIsLoading(false);
    }
  }, [data, orbitPath]);

  // Sicherheitsabfrage, wenn `data` oder `orbitPath` noch nicht verfügbar sind
  if (isLoading) {
    console.log("Data or orbit path not available yet.");
    return <p>Loading ISS data...</p>;
  }

  if (!data) {
    return <p>Error: ISS data not available.</p>;
  }

  return (
    <div>
      <h2>ISS Position:</h2>
      <p>Latitude: {data.latitude}</p>
      <p>Longitude: {data.longitude}</p>
      <p>Altitude: {data.altitude}</p>
      <p>Velocity: {data.velocity}</p>
    </div>
  );
}
