import React from "react";
import { clockConfig } from "../_config/config";


interface ClockMonthsProps {
  radius: number; // Radius für die Monatsnamen
  currentMonth: number; // Aktueller Monat (0–11)
}

const roundToFourDecimals = (num: number) => parseFloat(num.toFixed(4));

const ClockMonths: React.FC<ClockMonthsProps> = ({ radius, currentMonth }) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const centerX = 50; // SVG-Zentrum (50%)
  const centerY = 50;

  // Erstelle Pfade für die Monatsnamen
  const monthPaths = monthNames.map((_, index) => {
    const angleStart = (index / 12) * 360; // Startwinkel für den Monat
    const angleEnd = ((index + 1) / 12) * 360; // Endwinkel für den Monat

    // Koordinaten berechnen
    const startX =
      roundToFourDecimals(centerX + radius * Math.cos((angleStart - 90) * (Math.PI / 180))); // -90 für Korrektur nach oben
    const startY =
      roundToFourDecimals(centerY + radius * Math.sin((angleStart - 90) * (Math.PI / 180)));
    const endX =
      roundToFourDecimals(centerX + radius * Math.cos((angleEnd - 90) * (Math.PI / 180)));
    const endY =
      roundToFourDecimals(centerY + radius * Math.sin((angleEnd - 90) * (Math.PI / 180)));

    // Pfad als Bogen
    return (
      <path
        key={`monthPath-${index}`}
        id={`monthPath-${index}`}
        d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
        fill="none"
        stroke="none"
      />
    );
  });

  // Monatsnamen als Texte
  const monthTexts = monthNames.map((month, index) => {
    const isCurrentMonth = index === currentMonth; // Überprüfung für den aktuellen Monat

    return (
      <text
        key={`month-${index}`}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={isCurrentMonth ? clockConfig.sizes.currentDayFontSize : clockConfig.sizes.dayFontSize}
        fill={isCurrentMonth ? clockConfig.colors.currentDayMonthColor : clockConfig.colors.dayColor}
        fontWeight={isCurrentMonth ? clockConfig.styles.currentMonthFontWeight : clockConfig.styles.defaultMonthFontWeight}      
      >
        <textPath
          href={`#monthPath-${index}`}
          startOffset="50%" // Zentrierung des Textes
        >
          {month}
        </textPath>
      </text>
    );
  });

  // Berechne die Rotation, um den aktuellen Monat an 12 Uhr (0 Grad) zu positionieren
  const rotationAngle = -(currentMonth * 30 + 15); // Jeder Monat entspricht 30 Grad

  return ( 
    <g transform={`rotate(${rotationAngle}, ${centerX}, ${centerY})`}>
      {/* Pfade für die Monate */}
      {monthPaths}
      {/* Texte der Monate */}
      {monthTexts}
    </g>
    );
};

export default ClockMonths;
