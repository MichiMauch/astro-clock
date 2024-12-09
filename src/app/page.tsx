"use client";
import React from "react";
import ClockFace from "./clock/_components/ClockFace";
import { AstronomyProvider } from "../context/AstronomyContext";
import MoonCard from "./cards/_components/MoonCard";
import EarthCard from "./cards/_components/EarthCard";
import ApodImage from "./imageoftheday/box1/imageoftheday";
import EarthImageGallery from "./epic/box1/EarthImageWidget";

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center relative px-4 py-4">
      <AstronomyProvider>
        {/* Erste Reihe */}
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-4">
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
        <div className="w-full flex flex-col justify-center items-center">
          {/* Einzelne Box, die die gesamte Breite einnimmt */}
          <div className="flex flex-col items-center justify-center w-full">
            <ApodImage />
          </div>
        </div>
        {/* Dritte Reihe */}
        <div className="w-full flex flex-col justify-center items-center pt-4">
          {/* Einzelne Box, die die gesamte Breite einnimmt */}
          <div className="flex flex-col items-center justify-center w-full">
            <EarthImageGallery />
          </div>
        </div>
      </AstronomyProvider>
    </main>
  );
}
