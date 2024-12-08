import React, { useState, useEffect } from "react";
import { useAstronomyContext } from "@/context/AstronomyContext";

// Statische URLs für Bilder
const SunriseIcon = "/images/sunrise.svg";
const SunsetIcon = "/images/sunset.svg";

const MoonCard: React.FC = () => {
  const { sunrise, sunset, dayLength, solarNoon, sunDistance } = useAstronomyContext();
  const [earthImage, setEarthImage] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const fetchEarthImage = async () => {
      const apiUrl = "/api/earth";
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setEarthImage(imageUrl);
      } catch (error) {
        console.error("Fehler beim Abrufen des Erdbildes:", error);
      }
    };

    if (typeof window !== "undefined") {
      fetchEarthImage();
    }
  }, []);

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
            <img src={SunriseIcon} alt="Sunrise" className="w-6 h-6 mr-2" />
            <p>{sunrise}</p>
          </div>
          <div className="flex items-center">
            <img src={SunsetIcon} alt="Sunset" className="w-6 h-6 mr-2" />
            <p>{sunset}</p>
          </div>
        </div>
        {earthImage ? (
          <div
            className="items-center mt-4 rounded-full overflow-hidden"
            style={{
              width: "250px", // Festlegen der Breite
              height: "250px", // Festlegen der Höhe
              clipPath: "circle(50%)", // Zuschneiden des Bildes zu einem Kreis
            }}
          >
            <img
              src={earthImage}
              alt="Earth"
              className="w-full h-full"
            />
          </div>
        ) : (
          <p>Lade Erdbild...</p>
        )}
       <div className="text-left pt-4 pb-4">
          <p className="underline decoration-dotted font-sans">Distance</p>
          <p>{formatNumber(sunDistance)} km</p>
        </div>
        <div className="flex justify-between">
          <div className="text-left">
            <p className="underline decoration-dotted font-sans">Day-Length</p>
            <p>{dayLength}</p>
          </div>
          <div className="text-left">
            <p className="underline decoration-dotted font-sans">Solar-Noon</p>
            <p>{solarNoon}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoonCard;
