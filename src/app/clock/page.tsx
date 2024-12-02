"use client"
import React from "react";
import ClockFace from "../clock/_components/ClockFace";
import { AstronomyProvider } from "../../context/AstronomyContext";

export default function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <AstronomyProvider>
        <div className="relative w-full h-full overflow-hidden flex justify-center items-center container">
          <ClockFace />
        </div>
      </AstronomyProvider>
    </main>
  );
}
