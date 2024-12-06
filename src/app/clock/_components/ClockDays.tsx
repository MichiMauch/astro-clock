import React, { useEffect, useState } from "react";
import { clockConfig } from "../_config/config";

interface ClockDaysProps {
  radius: number; // Basisradius für die Zahlen
  numbers: number[]; // Liste der Zahlen, z. B. [1, 2, ..., 31]
  currentDay: number; // Aktueller Tag (1–31)
  offset?: number; // Zusätzlicher Offset für die Zahlen (z. B. 2px)
}

const roundToFourDecimals = (num: number) => parseFloat(num.toFixed(4));

const ClockDays: React.FC<ClockDaysProps> = ({
  radius,
  numbers,
  currentDay,
  offset = 0, // Standardwert für den Offset: 0
}) => {
  const [today, setToday] = useState<number | null>(null); // Aktueller Tag

  useEffect(() => {
    const updateToday = () => setToday(new Date().getUTCDate());
    if (typeof window !== 'undefined') {
      updateToday();
      const interval = setInterval(updateToday, 86400000); // Aktualisiere täglich (86400000 ms = 24 Stunden)
      return () => clearInterval(interval); // Bereinige das Intervall beim Unmounten
    }
  }, []);

  const centerX = 50; // Zentrum des SVG (50%)
  const centerY = 50;

  if (today === null) {
    return null; // Rendern Sie nichts, bis der aktuelle Tag gesetzt ist
  }

  return (
    <g>
      {numbers.map((num, index) => {
        // Berechne den verschobenen Index
        const adjustedIndex = (index - (currentDay - 1) + numbers.length) % numbers.length;

        // Winkel für die Position der Zahl (0 Grad oben)
        const angle = (360 / numbers.length) * adjustedIndex - 90; // -90 Grad für Korrektur
        const radian = (angle * Math.PI) / 180; // Umrechnung in Bogenmaß

        // Koordinaten der Zahl mit zusätzlichem Offset
        const x = roundToFourDecimals(centerX + (radius + offset) * Math.cos(radian)); // x-Koordinate
        const y = roundToFourDecimals(centerY + (radius + offset) * Math.sin(radian)); // y-Koordinate

        return (
          <text
            key={num}
            x={x + "%"} // Position
            y={y + "%"}
            textAnchor="middle" // Zentriert die Texte
            dominantBaseline="middle" // Vertikale Zentrierung
            fontSize={
              num === today
                ? clockConfig.sizes.currentDayFontSize // Größere Schrift für den aktuellen Tag
                : clockConfig.sizes.dayFontSize // Normale Schriftgröße für andere Tage
            }
            fill={
              num === today
                ? clockConfig.colors.currentDayMonthColor // Spezielle Farbe für den aktuellen Tag
                : clockConfig.colors.dayColor // Normale Farbe für andere Tage
            }
            fontWeight={num === today ? "bold" : "normal"} // Fett für den aktuellen Tag
          >
            {num}
          </text>
        );
      })}
    </g>
  );
};

export default ClockDays;