"use client";
import React from "react";
import ClockFace from "./clock/_components/ClockFace";
import { AstronomyProvider } from "../context/AstronomyContext";
import MoonCard from "./cards/_components/MoonCard";
import EarthCard from "./cards/_components/EarthCard";
import MoonCard2 from "./cards/_components/MoonCard2";
import SunCard2 from "./cards/_components/SunCard2";

export default function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen relative">
      <AstronomyProvider>
        <div className="w-full min-h-screen flex flex-col lg:flex-row justify-center items-center lg:space-x-8 px-8">
          <div className="flex flex-col space-y-4">
            <EarthCard />
            <MoonCard2 />
          </div>
          <ClockFace />
          <div className="flex flex-col space-y-4">
            <MoonCard />
            <SunCard2 />
          </div>
        </div>
      </AstronomyProvider>
    </main>
  );
}
