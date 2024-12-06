"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCombinedAstronomyData } from "../services/dataAggregator"; // Importiere die Funktion

// Definiere den Typ für die Daten
interface AstronomyData {
  sunEclipticLongitude: number;
  moonEclipticLongitude: number;
  moonIllumination: string;
  moonDistance: number;
  sunDistance: number;
  earthEclipticLongitude: number;
  moonPhaseAngle?: number; // Mondphasenwinkel hinzufügen
  date?: string;
  sunrise?: string;
  sunset?: string;
  moonPhase?: string;
}

// Standardwerte für den Kontext
const defaultAstronomyData: AstronomyData = {
  sunEclipticLongitude: 0,
  moonEclipticLongitude: 0,
  moonIllumination: "0%",
  moonDistance: 0,
  sunDistance: 0,
  earthEclipticLongitude: 0,
  moonPhaseAngle: 0, // Standardwert
  moonPhase: "0",
};

// Berechnung des Mondphasenwinkels
const calculateMoonPhaseAngle = (sunLongitude: number, moonLongitude: number): number => {
  const angle = (moonLongitude - sunLongitude + 360) % 360; // Sicherstellen, dass der Winkel positiv bleibt
  return parseFloat(angle.toFixed(2)); // Runden auf 2 Dezimalstellen
};

const roundToFourDecimals = (num: number) => parseFloat(num.toFixed(4));

// Erstelle den Kontext
const AstronomyContext = createContext<AstronomyData>(defaultAstronomyData);

// Exportiere einen Hook für einfacheren Zugriff
export const useAstronomyContext = () => useContext(AstronomyContext);

// Erstelle den Provider
export const AstronomyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AstronomyData>(defaultAstronomyData);

  const fetchData = async (latitude?: number, longitude?: number) => {
    try {
      const result = await getCombinedAstronomyData(latitude, longitude); // Abruf der kombinierten Daten
      if (result) {
        const roundedResult = {
          ...result,
          sunEclipticLongitude: roundToFourDecimals(result.sunEclipticLongitude),
          moonEclipticLongitude: roundToFourDecimals(result.moonEclipticLongitude),
          moonDistance: roundToFourDecimals(result.moonDistance),
          sunDistance: roundToFourDecimals(result.sunDistance),
          earthEclipticLongitude: roundToFourDecimals(result.earthEclipticLongitude),
        };
        const moonPhaseAngle = calculateMoonPhaseAngle(roundedResult.sunEclipticLongitude, roundedResult.moonEclipticLongitude); // Berechnung des Mondphasenwinkels
        setData({ ...roundedResult, moonPhaseAngle }); // Setze die abgerufenen Daten inklusive des Winkels
      } else {
        console.error("Keine Daten gefunden");
      }
    } catch (error) {
      console.error("Fehler beim Abrufen der astronomischen Daten:", error);
    }
  };

  useEffect(() => {
    fetchData(); // Initialer Abruf mit Standardkoordinaten
  }, []);

  return (
    <AstronomyContext.Provider value={data}>
      {children}
    </AstronomyContext.Provider>
  );
};
