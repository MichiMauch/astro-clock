"use client"
import React, { useState, useEffect } from "react";

interface ClockEarthPhaseProps {
  radius: number; // Radius des Minutenkreises
  centerX: number; // X-Koordinate des Mittelpunkts (z. B. 50%)
  centerY: number; // Y-Koordinate des Mittelpunkts (z. B. 50%)
}

const ClockEarthPhase: React.FC<ClockEarthPhaseProps> = ({
  radius,
  centerX,
  centerY, // Füge `className` hier als Parameter hinzu

}) => {
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

    if (typeof window !== 'undefined') {
      fetchEarthImage();
    }
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  if (!earthImage) {
    return <p>Lade Erdbild...</p>;
  }

  return (
<g
>      <defs>
        <clipPath id="earthClip">
          <circle cx={centerX} cy={centerY} r={radius} />
        </clipPath>
      </defs>
      <image
        href={earthImage}
        x={centerX - radius}
        y={centerY - radius}
        width={radius * 2}
        height={radius * 2}
        clipPath="url(#earthClip)"
      />
    </g>
  );
};

export default ClockEarthPhase;