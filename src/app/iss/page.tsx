"use client";

import dynamic from "next/dynamic";
import IssDataProvider, { IssContext } from "./_components/issDataProvider";
import { useContext, useEffect, useState } from "react";

// Dynamisches Laden von IssMap
const IssMap = dynamic(() => import("./_components/issMap"), { ssr: false });
// Dynamisches Laden von MapboxMap
const MapboxMap = dynamic(() => import("./_components/mapboxMap"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <IssDataProvider>
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center z-50">
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

  return (
    <div className="w-full flex flex-col items-center z-50">
      {/* Leaflet-Karte */}
      <div className="w-full h-[500px] mb-6">
        <IssMap data={data} orbitPath={orbitPath} />
      </div>
      {/* Mapbox-Karte */}
      <div className="w-full h-[500px] z-100">
        <MapboxMap data={data} orbitPath={orbitPath} />
      </div>
    </div>
  );
}
