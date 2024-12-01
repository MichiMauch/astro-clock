"use client";
import React from "react";
import { clockConfig } from "../_config/config";

interface ClockMoonPhaseProps {
  radius: number; // Radius des Kreises
  centerX: number; // X-Koordinate des Mittelpunkts (z. B. 50%)
  centerY: number; // Y-Koordinate des Mittelpunkts (z. B. 50%)
}

const ClockMoonPhase: React.FC<ClockMoonPhaseProps> = ({
  radius,
  centerX,
  centerY,
}) => {
  return (
    <g>
      {/* Kreis für die Mondphasen */}
      <circle
        cx={`${centerX}%`} // X-Koordinate
        cy={`${centerY}%`} // Y-Koordinate
        r={`${radius}%`} // Radius
        fill={clockConfig.colors.moonPhaseFill} // Füllfarbe aus Config
        stroke={clockConfig.colors.moonPhaseStroke} // Rahmenfarbe aus Config
        strokeWidth={clockConfig.strokeWidths.moonPhase} // Rahmenbreite aus Config
      />
    </g>
  );
};

export default ClockMoonPhase;
