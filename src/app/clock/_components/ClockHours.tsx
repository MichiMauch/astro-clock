import React from "react";
import { clockConfig } from "../_config/config";


interface ClockHoursProps {
  radius: number; // Radius für die Stunden
  offset?: number; // Zusätzlicher Offset für die Textpfade
}

const roundToFourDecimals = (num: number) => parseFloat(num.toFixed(4));

const ClockHours: React.FC<ClockHoursProps> = ({ radius, offset = 0 }) => {
  const romanNumbers = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
    "XIII",
    "XIV",
    "XV",
    "XVI",
    "XVII",
    "XVIII",
    "XIX",
    "XX",
    "XXI",
    "XXII",
    "XXIII",
    "XXIV",
  ];

  const centerX = 50; // SVG-Zentrum (50%)
  const centerY = 50;

  // Erstelle Pfade für die römischen Zahlen
  const hourPaths = romanNumbers.map((_, index) => {
    const angleStart = (index / romanNumbers.length) * 360; // Startwinkel
    const angleEnd = ((index + 1) / romanNumbers.length) * 360; // Endwinkel

    // Koordinaten berechnen
    const startX =
      roundToFourDecimals(centerX + (radius + offset) * Math.cos((angleStart - 90) * (Math.PI / 180))); // -90 für Korrektur
    const startY =
      roundToFourDecimals(centerY + (radius + offset) * Math.sin((angleStart - 90) * (Math.PI / 180)));
    const endX =
      roundToFourDecimals(centerX + (radius + offset) * Math.cos((angleEnd - 90) * (Math.PI / 180)));
    const endY =
      roundToFourDecimals(centerY + (radius + offset) * Math.sin((angleEnd - 90) * (Math.PI / 180)));

    // Pfad als Bogen
    return (
      <path
        key={`hourPath-${index}`}
        id={`hourPath-${index}`}
        d={`M ${startX} ${startY} A ${radius + offset} ${radius + offset} 0 0 1 ${endX} ${endY}`}
        fill="none"
        stroke="none"
      />
    );
  });

  // Texte entlang der Pfade
  const hourTexts = romanNumbers.map((roman, index) => (
    <text
      key={`hour-${index}`}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={clockConfig.sizes.hourFontSize} // Schriftgröße aus Config
      fill={clockConfig.colors.hourColor} // Farbe aus Config
    >
      <textPath
        href={`#hourPath-${index}`}
        startOffset="50%" // Zentrierung des Textes
      >
        {roman}
      </textPath>
    </text>
  ));

  // Drehung um 187 Grad, damit XII bei 0 Grad steht
  const rotationAngle = + 187;

  return (
    <g transform={`rotate(${rotationAngle}, ${centerX}, ${centerY})`}>
      {/* Pfade für die Stunden */}
      {hourPaths}
      {/* Texte für die Stunden */}
      {hourTexts}
    </g>
  );
};

export default ClockHours;
