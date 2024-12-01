"use client"
import React, { useState, useEffect } from "react";
import { clockConfig } from "../_config/config";


interface ClockMinutesProps {
  radius: number; // Radius des Minutenkreises
  centerX: number; // X-Koordinate des Mittelpunkts (z. B. 50%)
  centerY: number; // Y-Koordinate des Mittelpunkts (z. B. 50%)
  secondHandLength?: number; // Länge des Sekundenzeigers (Standardwert: 1.0 = 100%)
}

const ClockMinutes: React.FC<ClockMinutesProps> = ({
  radius,
  centerX,
  centerY,
  secondHandLength = 0.6, // Standardlänge des Sekundenzeigers
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    let animationFrameId: number;

    const updateTime = () => {
      setCurrentTime(new Date());
      animationFrameId = requestAnimationFrame(updateTime); // Animation fortsetzen
    };

    animationFrameId = requestAnimationFrame(updateTime);

    return () => cancelAnimationFrame(animationFrameId); // Bereinigung
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server
  }

  // Berechnung der genauen Sekunden inklusive Millisekunden
  const seconds =
    currentTime.getSeconds() + currentTime.getMilliseconds() / 1000;

  // Berechnung der genauen Minuten inklusive Sekundenanteil
  const minutes =
    currentTime.getMinutes() + seconds / 60;

  // Winkelberechnung für den Minutenzeiger
  const minuteAngle = (minutes / 60) * 360 - 90; // -90 Grad für Start oben
  const minuteRadian = (minuteAngle * Math.PI) / 180;

  // Endpunkt des Minutenzeigers
  const minuteHandX = centerX + radius * Math.cos(minuteRadian);
  const minuteHandY = centerY + radius * Math.sin(minuteRadian);

  // Winkelberechnung für den Sekundenzeiger
  const secondAngle = (seconds / 60) * 360 - 90; // -90 Grad für Start oben
  const secondRadian = (secondAngle * Math.PI) / 180;

  // Endpunkt des Sekundenzeigers (mit Skalierung der Länge)
  const secondHandX =
    centerX + secondHandLength * radius * Math.cos(secondRadian);
  const secondHandY =
    centerY + secondHandLength * radius * Math.sin(secondRadian);

  // Funktion, um alle Minutenmarkierungen zu generieren
  const renderMinuteMarks = () => {
    const marks: JSX.Element[] = [];

    for (let minute = 0; minute < 60; minute++) {
      const isMajorMark = minute % 5 === 0; // Jede 5. Minute ist eine grö��ere Markierung
      const markLength = isMajorMark ? 2 : 1; // Länge der Striche (größere Markierungen sind länger)
      const strokeWidth = isMajorMark ? 0.4 : 0.15; // Dicke der Striche (größere Markierungen sind dicker)

      const markAngle = (minute / 60) * 360 - 90; // -90 Grad für Start oben
      const markRadian = (markAngle * Math.PI) / 180;

      // Start- und Endpunkt des Strichs berechnen
      const startX = centerX + radius * Math.cos(markRadian);
      const startY = centerY + radius * Math.sin(markRadian);
      const endX = centerX + (radius - markLength) * Math.cos(markRadian);
      const endY = centerY + (radius - markLength) * Math.sin(markRadian);

      marks.push(
        <line
          key={`minute-mark-${minute}`}
          x1={`${startX}%`}
          y1={`${startY}%`}
          x2={`${endX}%`}
          y2={`${endY}%`}
          stroke="black"
          strokeWidth={strokeWidth}
        />
      );
    }

    return marks;
  };

  return (
    <>{isClient && (
      <g>
        {/* Kreis für Minuten */}
        <circle
          cx={`${centerX}%`}
          cy={`${centerY}%`}
          r={`${radius}%`}
          fill="none"
          stroke={clockConfig.colors.circleStroke} // Farbe aus Config
          strokeWidth={clockConfig.strokeWidths.circleStroke} // Dicke aus Config
        />
        {/* Minutenzeiger */}
        <line
          x1={`${centerX}%`} // Startpunkt des Zeigers
          y1={`${centerY}%`}
          x2={`${minuteHandX}%`} // Endpunkt des Zeigers
          y2={`${minuteHandY}%`}
          stroke={clockConfig.colors.minuteHand} // Farbe aus Config
          strokeWidth={clockConfig.strokeWidths.minuteHand} // Dicke aus Config
          strokeLinecap={clockConfig.styles.minuteHandCap as "round" | "butt" | "square" | "inherit"} // Ende aus Config
        />
        {/* Sekundenzeiger */}
        <line
          x1={`${centerX}%`} // Startpunkt des Zeigers
          y1={`${centerY}%`}
          x2={`${secondHandX}%`} // Endpunkt des Zeigers
          y2={`${secondHandY}%`}
          stroke={clockConfig.colors.secondHand} // Farbe aus Config
          strokeWidth={clockConfig.strokeWidths.secondHand} // Dicke aus Config
          strokeLinecap={clockConfig.styles.secondHandCap as "round" | "butt" | "square" | "inherit"} // Ende aus Config
        />
        {/* Roter Punkt am Ende des Sekundenzeigers */}
        <circle
          cx={`${secondHandX}%`}
          cy={`${secondHandY}%`}
          r={`${clockConfig.sizes.secondHandDot}%`} // Radius aus Config
          fill={clockConfig.colors.secondHandDot} // Farbe aus Config
        />

        {/* Alle Minutenmarkierungen */}
        {renderMinuteMarks()}
      </g>
    )}</>
  );
};

export default ClockMinutes;
