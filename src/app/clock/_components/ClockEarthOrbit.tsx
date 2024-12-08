import React from "react";
import { clockConfig } from "../_config/config";


interface ClockEarthProps {
  radius: number; // Umlaufbahnradius
  centerX: number; // X-Koordinate des Mittelpunkts
  centerY: number; // Y-Koordinate des Mittelpunkts
}

const ClockEarth: React.FC<ClockEarthProps> = ({ radius, centerX, centerY }) => {
  const now = new Date();
  const dayOfYear = Math.floor(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 0)) /
      86400000
  ); // Tagesnummer im Jahr (1–365)

  // Winkel für die Erde basierend auf der Tagesnummer
  const earthAngle = (2 * Math.PI * dayOfYear) / 365;

  // Position der Erde relativ zur Sonne
  const earthX = centerX + radius * Math.cos(earthAngle);
  const earthY = centerY + radius * Math.sin(earthAngle);

  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* Umlaufbahn */}
      <circle
        cx={centerX}
        cy={centerY}
        r={radius}
        stroke={clockConfig.colors.earthOrbitColor}
        strokeWidth={clockConfig.strokeWidths.earthOrbit}
        fill="none"
        strokeDasharray="1 1" // gestrichelte Linie
      />
      {/* Erde auf der Umlaufbahn */}
      <image
        href="https://upload.wikimedia.org/wikipedia/commons/7/7f/Rotating_earth_animated_transparent.gif"
        x={earthX - 4}
        y={earthY - 4}
        height="8"
        width="8"
      />
      {/* Gruppe für die Sonne */}
      <g>
        <image
          href="/images/sun.svg"
          x={centerX - 5}
          y={centerY - 5}
          height="10"
          width="10"
        />
      </g>
    </svg>
  );
};

export default ClockEarth;
