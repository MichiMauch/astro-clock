import React, { useEffect, useState } from "react";

interface ClockMoonPhaseProps {
  radius: number;
  centerX: number;
  centerY: number;
}

const ClockMoonPhase: React.FC<ClockMoonPhaseProps> = ({
  radius,
  centerX,
  centerY,
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

    if (typeof window !== 'undefined') {
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
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Kreis als Rahmen */}
      <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="none" />
      
      {/* Mondbild */}
      <defs>
        <clipPath id="circleClip">
          <circle cx={centerX} cy={centerY} r={radius} />
        </clipPath>
      </defs>
      <image
        href={moonImage}
        x={centerX - radius}
        y={centerY - radius}
        width={radius * 2}
        height={radius * 2}
        clipPath="url(#circleClip)"
        style={{
          filter: "sepia(0.6) brightness(1.2)", // Sepia für Gelbton, Brightness für Helligkeit
        }}
      />
    </svg>
  );
};

export default ClockMoonPhase;
