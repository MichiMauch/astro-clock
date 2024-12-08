import React, { useState, useEffect } from "react";
import { useAstronomyContext } from "@/context/AstronomyContext";

// Statische URLs für Bilder
const MoonriseIcon = "/images/moonrise.svg";
const MoonsetIcon = "/images/moonset.svg";

const SunCard: React.FC = () => {
  const { moonrise, moonset, moonPhase, moonDistance } = useAstronomyContext();
  const [moonImage, setMoonImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchMoonImage = async () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const currentHour = now.getUTCHours();
      const apiUrl = `https://svs.gsfc.nasa.gov/api/dialamoon/${today}T${String(currentHour).padStart(2, '0')}:00`;
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data.image && data.image.url) {
          setMoonImage(data.image.url);
        }
      } catch (error) {
        console.error("Fehler beim Abrufen des Mondbildes:", error);
      }
    };

    if (typeof window !== "undefined") {
      fetchMoonImage();
    }
  }, []);

  const formatMoonPhase = (phase: string) => {
    return phase
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase()) + ' Moon';
  };

  const calculateMoonAge = () => {
    const lastNewMoon = new Date('2024-12-02');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastNewMoon.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % 29.530588; // Mondzyklus beträgt etwa 29,53 Tage
  };

  const moonAge = calculateMoonAge();

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("de-CH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number);
  };

  if (!isClient) {
    return null; // Render nothing on the server
  }

  return (
<div className="relative m-4 p-8 w-full max-w-[400px] flex flex-col items-center justify-center bg-black bg-opacity-70 text-white rounded-lg">
  <div className="font-dmmono text-center text-base">
        <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={MoonriseIcon} alt="Moonrise" className="w-6 h-6 mr-2" />
              <p>{moonrise}</p>
            </div>
            <div className="flex items-center">
              <img src={MoonsetIcon} alt="Moonset" className="w-6 h-6 mr-2" />
              <p>{moonset}</p>
            </div>
          </div>
        {moonImage ? (
          <div
            className="items-center mt-4 rounded-full overflow-hidden"
            style={{
              width: "250px", // Festlegen der Breite
              height: "250px", // Festlegen der Höhe
              clipPath: "circle(50%)", // Zuschneiden des Bildes zu einem Kreis
            }}
          >
            <img
              src={moonImage}
              alt="Moon"
              className="w-full h-full"
              style={{
                transform: "scale(1.2)", // Vergrößert das Bild leicht
                filter: "sepia(0.6) brightness(1.2)", // Sepia für Gelbton, Brightness für Helligkeit
              }}
            />
          </div>
        ) : (
          <p>Lade Mondbild...</p>
        )}
        <div className="text-left pt-4 pb-4">
          <p className="underline decoration-dotted font-sans">Current Phase</p>
          <p>{moonPhase ? formatMoonPhase(moonPhase) : "Unknown Moon Phase"}</p>
        </div>
        <div className="flex justify-between">
          <div className="text-left">
            <p className="underline decoration-dotted font-sans">Moon age</p>
            <p>{moonAge.toFixed(0)} Days</p>
          </div>
          <div className="text-left">
            <p className="underline decoration-dotted font-sans">Distance</p>
            <p>{formatNumber(moonDistance)} km</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SunCard;
