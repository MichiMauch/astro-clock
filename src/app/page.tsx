"use client";
import React, { useState, useEffect } from "react";
import ClockFace from "./clock/_components/ClockFace";
import { AstronomyProvider } from "../context/AstronomyContext";
import MoonCard from "./cards/_components/MoonCard";
import SunCard from "./cards/_components/SunCard";
import "./cards/styles.css"; // Importieren Sie die CSS-Datei

export default function Home() {
  const [gradientDirection, setGradientDirection] = useState("bg-gradient-to-r");

  useEffect(() => {
    const directions = [
      "bg-gradient-to-r",   // Von links nach rechts
      "bg-gradient-to-l",   // Von rechts nach links
      "bg-gradient-to-t",   // Von unten nach oben
      "bg-gradient-to-b",   // Von oben nach unten
      "bg-gradient-to-tr",  // Von unten links nach oben rechts
      "bg-gradient-to-br",  // Von oben links nach unten rechts
      "bg-gradient-to-tl",  // Von unten rechts nach oben links
      "bg-gradient-to-bl",  // Von oben rechts nach unten links
    ];

    const interval = setInterval(() => {
      setGradientDirection(directions[Math.floor(Math.random() * directions.length)]);
    }, 120000); // Richtung ändert sich nur alle 2 Minuten

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <AstronomyProvider>
        <div
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden", // Verhindert Scrollen
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Zentriert den Inhalt
          }}
          className={`${gradientDirection} from-black via-blue-900 via-indigo-800 via-purple-700 via-blue-600 via-indigo-500 to-black bg-[length:200%_200%] animate-gradient`}
        >
          <MoonCard />
          <ClockFace />
          <SunCard />
        </div>
      </AstronomyProvider>
    </main>
  );
}
