import React from "react";

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
        {/* Erde auf der Umlaufbahn */}
        <image
          href="https://upload.wikimedia.org/wikipedia/commons/7/7f/Rotating_earth_animated_transparent.gif"
          x={earthX - 3}
          y={earthY - 3}
          height="6"
          width="6"
        />

        {/* Gruppe für die Sonne */}
        <g>
          <image
            href="https://media.giphy.com/media/Z9z9cdHRbC4D417iOU/giphy.gif"
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
