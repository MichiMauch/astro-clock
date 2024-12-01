'use client';
import React from "react";
import { useAstronomyContext } from "@/context/AstronomyContext";
import { clockConfig } from "../_config/config";

interface ClockZodiacProps {
  radius: number; // Radius für die Position der Zeichen
  centerX: number; // X-Koordinate des Mittelpunkts (z. B. 50%)
  centerY: number; // Y-Koordinate des Mittelpunkts (z. B. 50%)
}

const roundToFourDecimals = (num: number) => parseFloat(num.toFixed(4));

const ClockZodiac: React.FC<ClockZodiacProps> = ({ radius, centerX, centerY }) => {
  const { sunEclipticLongitude } = useAstronomyContext(); // Holen des Wertes aus dem Kontext

  if (sunEclipticLongitude === null || sunEclipticLongitude === undefined) {
    return null; // Zeige nichts, wenn die Daten nicht verfügbar sind
  }

  // Reihenfolge der Tierkreiszeichen
  const zodiacSigns = [
    "aries",       // Widder
    "taurus",      // Stier
    "gemini",      // Zwillinge
    "cancer",      // Krebs
    "leo",         // Löwe
    "virgo",       // Jungfrau
    "libra",       // Waage
    "scorpio",     // Skorpion
    "sagittarius", // Schütze
    "capricorn",   // Steinbock
    "aquarius",    // Wassermann
    "pisces",      // Fische
  ];

  // Berechne den Winkel für den Zeiger basierend auf dem Sonnenlängengrad
  const pointerAngle = sunEclipticLongitude - 90; // -90 Grad für Start oben
  const pointerRadian = (pointerAngle * Math.PI) / 180; // Umrechnung in Bogenmaß

  // Berechne die Position der Zeigerspitze
  const pointerLength = radius * clockConfig.lengths.zodiacPointer; // Nutze die Länge aus der Config
  const pointerX = roundToFourDecimals(centerX + pointerLength * Math.cos(pointerRadian));
  const pointerY = roundToFourDecimals(centerY + pointerLength * Math.sin(pointerRadian));

  return (
    <g>
      {/* Zeiger */}
      <line
        x1={`${centerX}%`} // Startpunkt in der Mitte
        y1={`${centerY}%`}
        x2={`${pointerX}%`} // Endpunkt basierend auf dem Winkel
        y2={`${pointerY}%`}
        stroke={clockConfig.colors.zodiacPointerColor}
        strokeWidth={clockConfig.strokeWidths.zodiacPointer}
        strokeLinecap={clockConfig.styles.zodiacPointerCap as "round" | "butt" | "square" | "inherit"}
      />
      {zodiacSigns.map((sign, index) => {
        // Berechne den Winkel für jedes Zeichen
        const angle = (360 / zodiacSigns.length) * index - 90; // -90 Grad für Start oben
        const radian = (angle * Math.PI) / 180; // Umrechnung in Bogenmaß

        // Berechne die Position jedes Zeichens
        const x = roundToFourDecimals(centerX + radius * Math.cos(radian));
        const y = roundToFourDecimals(centerY + radius * Math.sin(radian));

        return (
          <image
            key={sign}
            href={`/zodiacs/${sign}.svg`} // Pfad zum Icon
            x={`${x - 2.5}%`} // Zentriere das Icon (3% für die Hälfte der Breite)
            y={`${y - 2.5}%`} // Zentriere das Icon (3% für die Hälfte der Höhe)
            width="5%" // Größe des Icons
            height="5%"
          />
        );
      })}
    </g>
  );
};

export default ClockZodiac;
