import React, { useEffect, useState } from "react";
import { clockConfig } from "../_config/config";

interface ClockHourHandProps {
  radius: number; // Länge des Zeigers
  centerX: number; // X-Koordinate des Mittelpunkts (z. B. 50%)
  centerY: number; // Y-Koordinate des Mittelpunkts (z. B. 50%)
}

const roundToFourDecimals = (num: number) => parseFloat(num.toFixed(4));

const ClockHourHand: React.FC<ClockHourHandProps> = ({ radius, centerX, centerY }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours(); // Aktuelle Stunde (0-23)
  const minutes = time.getMinutes(); // Aktuelle Minute (0-59)

  // Berechne den Winkel des Zeigers (24-Stunden-Uhr)
  const totalHours = hours + minutes / 60; // Stunden inklusive Minutenanteil
  const angle = (totalHours / 24) * 360 + 90; // -90 Grad, um oben zu starten

  // Endpunkt des Zeigers berechnen
  const radian = (angle * Math.PI) / 180; // Umrechnung in Bogenmaß
  const endX = roundToFourDecimals(centerX + radius * Math.cos(radian));
  const endY = roundToFourDecimals(centerY + radius * Math.sin(radian));

  return (
    <line
      x1={`${centerX}%`} // Startpunkt in der Mitte des Zifferblatts
      y1={`${centerY}%`}
      x2={`${endX}%`} // Endpunkt (je nach Radius)
      y2={`${endY}%`}
      stroke={clockConfig.colors.handhourColor} // Farbe des Zeigers
      strokeWidth={clockConfig.sizes.handhourWidth} // Dicke des Zeigers
      strokeLinecap={clockConfig.styles.handLinecap as "round" | "butt" | "square" | "inherit" | undefined} // Endkappenform des Zeigers
    />
  );
};

export default ClockHourHand;
