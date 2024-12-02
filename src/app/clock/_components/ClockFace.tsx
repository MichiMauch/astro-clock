// clock/_components/ClockFace.tsx
import React from "react";
import { clockConfig } from "../_config/config";
import ClockDays from "./ClockDays";
import ClockMonths from "./ClockMonths";
import ClockHours from "./ClockHours";
import ClockHourHand from "./ClockHourHand";
import ClockZodiac from "./ClockZodiac";
import ClockMinutes from "./ClockMinutes";
import ClockMoonPhase from "./ClockMoonPhase";
import ClockMoonIcons from "./ClockMoonIcons";

const ClockFace: React.FC = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDate(); // Aktueller Tag
  const currentMonth = currentDate.getMonth(); // Aktueller Monat

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-[60vmin] h-[60vmin] max-w-[80vmin] max-h-[80vmin] z-10"
    >
      <circle
        cx="50%"
        cy="50%"
        r={clockConfig.sizes.faceRadius1}
        fill={clockConfig.colors.faceFill1}
        stroke={clockConfig.colors.faceStroke1}
        strokeWidth={clockConfig.strokeWidths.face1}
      />
      <ClockDays
        radius={45} // Abstand von der Mitte (anpassen je nach Design)
        numbers={[...Array(31).keys()].map((n) => n + 1)} // Zahlen 1 bis 31
        currentDay={currentDay} // Aktueller Tag
      />
      <circle
        cx="50%"
        cy="50%"
        r={clockConfig.sizes.faceRadius2}
        fill={clockConfig.colors.faceFill2}
        stroke={clockConfig.colors.faceStroke2}
        strokeWidth={clockConfig.strokeWidths.face2}
      />
      <ClockMonths
        radius={39} // Platzierung zwischen zweitem und drittem Kreis
        currentMonth={currentMonth} // Aktueller Monat
      />
      <circle
        cx="50%"
        cy="50%"
        r={clockConfig.sizes.faceRadius3}
        fill={clockConfig.colors.faceFill3}
        stroke={clockConfig.colors.faceStroke3}
        strokeWidth={clockConfig.strokeWidths.face3}
      />
      <ClockHours radius={32} offset={2} />
      <circle
        cx="50%"
        cy="50%"
        r={clockConfig.sizes.faceRadius4}
        fill={clockConfig.colors.faceFill4}
        stroke={clockConfig.colors.faceStroke4}
        strokeWidth={clockConfig.strokeWidths.face4}
      />
      <circle
        cx="50%"
        cy="50%"
        r={clockConfig.sizes.faceRadius5}
        fill={clockConfig.colors.faceFill5}
        stroke={clockConfig.colors.faceStroke5}
        strokeWidth={clockConfig.strokeWidths.face5}
      />
      <ClockZodiac radius={28} centerX={50} centerY={50} />
      <ClockMoonIcons radius={20.5} centerX={50} centerY={50} />
      <ClockMinutes radius={7} centerX={50} centerY={40} />
      <ClockMoonPhase radius={7} centerX={50} centerY={60} />
      <ClockHourHand radius={30} centerX={50} centerY={50} />
    </svg>
  );
};

export default ClockFace;
