'use client';
import React from "react";
import { useAstronomyContext } from "@/context/AstronomyContext"; // Importiere den Kontext
import { clockConfig } from "../_config/config";

interface ClockMoonIconsProps {
  radius: number; // Radius des Kreises
  centerX: number; // X-Koordinate des Mittelpunkts
  centerY: number; // Y-Koordinate des Mittelpunkts
}

const roundToFourDecimals = (num: number) => parseFloat(num.toFixed(4));

const ClockMoonIcons: React.FC<ClockMoonIconsProps> = ({ radius, centerX, centerY }) => {
  const { moonPhaseAngle = 0 } = useAstronomyContext(); // Holen des Mondphasen-Winkels aus dem Kontext

  // Reihenfolge der Mondphasen
  const moonPhases = [
    "new_moon",         // Neumond
    "waxing_crescent",  // Zunehmende Sichel
    "first_quarter",    // Erstes Viertel
    "waxing_gibbous",   // Zunehmender Dreiviertelmond
    "full_moon",        // Vollmond
    "waning_gibbous",   // Abnehmender Dreiviertelmond
    "last_quarter",     // Letztes Viertel
    "waning_crescent",  // Abnehmende Sichel
  ];

  // Berechne den Zeigerwinkel basierend auf `moonPhaseAngle`
  const pointerAngle = moonPhaseAngle - 90; // -90 Grad für Start oben
  const pointerRadian = (pointerAngle * Math.PI) / 180; // Umrechnung in Bogenmaß

  // Berechne die Position der Zeigerspitze
  const pointerLength = radius * clockConfig.lengths.zodiacPointer; // Nutze eine Config-Länge für den Zeiger
  const pointerX = roundToFourDecimals(centerX + pointerLength * Math.cos(pointerRadian));
  const pointerY = roundToFourDecimals(centerY + pointerLength * Math.sin(pointerRadian));

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {/* Mondphasen-Icons */}
      {moonPhases.map((phase, index) => {
        // Berechne den Winkel für jedes Icon
        const angle = (360 / moonPhases.length) * index - 90; // -90 Grad für Start oben
        const radian = (angle * Math.PI) / 180; // Umrechnung in Bogenmaß

        // Berechne die Position jedes Icons
        const x = roundToFourDecimals(centerX + radius * Math.cos(radian));
        const y = roundToFourDecimals(centerY + radius * Math.sin(radian));

        return (
          <image
            key={phase}
            href={`/moon/${phase}.svg`} // Pfad zum Icon
            x={`${x - 2.5}%`} // Zentriere das Icon (2.5% für die Hälfte der Breite)
            y={`${y - 2.5}%`} // Zentriere das Icon (2.5% für die Hälfte der Höhe)
            width="5%" // Größe des Icons
            height="5%"
          />
        );
      })}

      {/* Zeiger */}
      <line
        x1={`${centerX}%`} // Startpunkt in der Mitte
        y1={`${centerY}%`}
        x2={`${pointerX}%`} // Endpunkt basierend auf dem Winkel
        y2={`${pointerY}%`}
        stroke={clockConfig.colors.moonPointerColor}
        strokeWidth={clockConfig.strokeWidths.moonPointer}
        strokeLinecap={clockConfig.styles.moonPointerCap as "round" | "butt" | "square" | "inherit"}
      />
    </svg>
  );
};

export default ClockMoonIcons;
