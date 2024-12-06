"use client";
import React, { useEffect, useState } from "react";

interface ClockMoonPhaseProps {
  radius: number; // Radius des Mondkreises
  centerX: number; // X-Koordinate des Mittelpunkts
  centerY: number; // Y-Koordinate des Mittelpunkts
}

const ClockMoonPhase: React.FC<ClockMoonPhaseProps> = ({
  radius,
  centerX,
  centerY, // Standardklasse
}) => {
  const [moonImage, setMoonImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Setze den Zustand auf true, wenn das Fensterobjekt verfügbar ist

    const fetchMoonImage = async () => {
      const now = new Date(); // Aktuelle Zeit
      const today = now.toISOString().split("T")[0]; // Aktuelles Datum im Format YYYY-MM-DD
      const currentHour = now.getUTCHours(); // Aktuelle Stunde in UTC
      const apiUrl = `https://svs.gsfc.nasa.gov/api/dialamoon/${today}T${String(currentHour).padStart(2, '0')}:00`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.image && data.image.url) {
          setMoonImage(data.image.url); // URL des JPG-Bilds speichern
        }
      } catch (error) {
        console.error("Fehler beim Abrufen des Mondbildes:", error);
      }
    };

    if (typeof window !== "undefined") {
      fetchMoonImage();
    }
  }, []);

  if (!isClient) {
    return null; // Rendern Sie nichts, bis das Fensterobjekt verfügbar ist
  }

  if (!moonImage) {
    return <p>Lade Mondbild...</p>;
  }

  return (
    <g
    >
      <defs>
        <clipPath id="moonCircleClip">
          <circle cx={centerX} cy={centerY} r={radius} />
        </clipPath>
      </defs>
      <circle cx={centerX} cy={centerY} r={radius} />
      <image
        href={moonImage}
        x={centerX - radius * 1.1} // 10% größer
        y={centerY - radius * 1.1} // 10% größer
        width={radius * 2.2} // Breite um 10% erhöhen
        height={radius * 2.2} // Höhe um 10% erhöhen
        clipPath="url(#moonCircleClip)"
        style={{
          filter: "sepia(0.6) brightness(1.2)", // Sepia für Gelbton, Brightness für Helligkeit
        }}
      />
    </g>
  );
};

export default ClockMoonPhase;
