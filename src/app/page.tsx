"use client";
import React from "react";
import ClockFace from "./clock/_components/ClockFace";
import { AstronomyProvider } from "../context/AstronomyContext";
import MoonCard from "./cards/_components/MoonCard";
import EarthCard from "./cards/_components/EarthCard";
import ApodImage from "./imageoftheday/box1/imageoftheday";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center relative">
      <AstronomyProvider>
        {/* Erste Reihe */}
        <div className="w-full flex flex-col lg:flex-row justify-center items-center space-x-8 px-8">
          {/* Linke Box */}
          <div className="flex flex-col items-center justify-center w-full lg:w-1/4">
            <EarthCard />
          </div>

          {/* Mittlere Box */}
          <div className="flex flex-col items-center justify-center w-full lg:w-2/4">
            <ClockFace />
          </div>

          {/* Rechte Box */}
          <div className="flex flex-col items-center justify-center w-full lg:w-1/4">
            <MoonCard />
          </div>
        </div>

        {/* Zweite Reihe */}
        <div className="w-full flex flex-col justify-center items-center px-8 p-4">
        {/* Einzelne Box, die die gesamte Breite einnimmt */}
          <div className="flex flex-col items-center justify-center w-full">
            <ApodImage />
          </div>
        </div>
      </AstronomyProvider>
    </main>
  );
}
