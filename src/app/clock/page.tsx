"use client"
import React from "react";
import ClockFace from "../clock/_components/ClockFace";
import { AstronomyProvider } from "../../context/AstronomyContext";

export default function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <AstronomyProvider>
        <div
          style={{
            position: "relative",
            width: "100vw",
            height: "100vh",
            overflow: "hidden", // Prevents scrolling
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // Zentriert den Inhalt
          }}
          className="container"
        >
          <ClockFace />
        </div>
      </AstronomyProvider>
    </main>
  );
}
