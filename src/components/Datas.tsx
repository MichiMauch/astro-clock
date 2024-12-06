"use client";

import { useState, useMemo, useCallback } from "react";
import Geolocation from "./Geolocation";
import { calculateMoonPhaseAngle, getMoonPhaseDescription } from "@/utils/moonPhaseHelper";
import { getCombinedAstronomyData } from "@/services/dataAggregator";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface DatasProps {
  initialAstronomyData: {
    sunEclipticLongitude: number;
    moonEclipticLongitude: number;
    moonIllumination: string;
    moonDistance: number;
    sunDistance: number;
    date: string;
    currentTime: string;
    sunrise: string;
    sunset: string;
    sunStatus?: string; // Optional gemacht
    solarNoon?: string; // Optional gemacht
    dayLength?: string; // Optional gemacht
    moonrise?: string; // Optional gemacht
    moonset?: string; // Optional gemacht
    street?: string; // Optional gemacht
    houseNumber?: string; // Optional gemacht
    quarter?: string; // Optional gemacht
    postcode?: string; // Optional gemacht
    city?: string; // Optional gemacht
    country?: string; // Optional gemacht
    moonPhase?: string;
    moonAltitude?: number; // Typ geändert
    moonAzimuth?: number; // Typ geändert
    moonDistanceAU: number; // Typ geändert
    moonDistanceKM: number; // Typ geändert
  };
}

export const Datas: React.FC<DatasProps> = ({ initialAstronomyData }) => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [astronomyData, setAstronomyData] = useState<DatasProps["initialAstronomyData"] | null>(initialAstronomyData);
  const [loading, setLoading] = useState(false);

  const handleCoordinatesLoaded = useCallback(async (coords: Coordinates) => {
    setCoordinates(coords);
    setLoading(true);
    console.log("Koordinaten geladen:", coords); // Debugging-Informationen hinzufügen
    const updatedAstronomyData = await getCombinedAstronomyData(coords.latitude, coords.longitude);
    if (updatedAstronomyData) {
      setAstronomyData({
        sunEclipticLongitude: updatedAstronomyData.sunEclipticLongitude,
        moonEclipticLongitude: updatedAstronomyData.moonEclipticLongitude,
        moonIllumination: updatedAstronomyData.moonIllumination.toString(),
        moonDistance: updatedAstronomyData.moonDistance,
        sunDistance: updatedAstronomyData.sunDistance,
        date: updatedAstronomyData.date,
        currentTime: updatedAstronomyData.currentTime,
        sunrise: updatedAstronomyData.sunrise,
        sunset: updatedAstronomyData.sunset,
        sunStatus: updatedAstronomyData.sunStatus,
        solarNoon: updatedAstronomyData.solarNoon,
        dayLength: updatedAstronomyData.dayLength,
        moonrise: updatedAstronomyData.moonrise,
        moonset: updatedAstronomyData.moonset,
        street: updatedAstronomyData.street,
        houseNumber: updatedAstronomyData.houseNumber,
        quarter: updatedAstronomyData.quarter,
        postcode: updatedAstronomyData.postcode,
        city: updatedAstronomyData.city,
        country: updatedAstronomyData.country,
        moonPhase: updatedAstronomyData.moonPhase,
        moonAltitude: updatedAstronomyData.moonAltitude,
        moonAzimuth: updatedAstronomyData.moonAzimuth,
        moonDistanceAU: updatedAstronomyData.moonDistanceAU,
        moonDistanceKM: updatedAstronomyData.moonDistanceKM,
      });
    }
    setLoading(false);
  }, []);

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 3,
    }).format(num);
  };

  const formattedAstronomyData = useMemo(() => {
    if (!astronomyData) return {};
    return {
      sunEclipticLongitude: formatNumber(astronomyData.sunEclipticLongitude),
      moonEclipticLongitude: formatNumber(astronomyData.moonEclipticLongitude),
      moonIllumination: astronomyData.moonIllumination,
      moonDistance: formatNumber(astronomyData.moonDistance),
      sunDistance: formatNumber(astronomyData.sunDistance),
      date: astronomyData.date,
      currentTime: astronomyData.currentTime,
      sunrise: astronomyData.sunrise,
      sunset: astronomyData.sunset,
      sunStatus: astronomyData.sunStatus,
      solarNoon: astronomyData.solarNoon,
      dayLength: astronomyData.dayLength,
      moonrise: astronomyData.moonrise,
      moonset: astronomyData.moonset,
      street: astronomyData.street,
      houseNumber: astronomyData.houseNumber,
      quarter: astronomyData.quarter,
      postcode: astronomyData.postcode,
      city: astronomyData.city,
      country: astronomyData.country,
      moonPhase: astronomyData.moonPhase,
      moonAltitude: astronomyData.moonAltitude?.toString(),
      moonAzimuth: astronomyData.moonAzimuth?.toString(),
      moonDistanceAU: formatNumber(astronomyData.moonDistanceAU),
      moonDistanceKM: formatNumber(astronomyData.moonDistanceKM),
    };
  }, [astronomyData]);

  const moonPhaseAngle = useMemo(() => 
    astronomyData ? calculateMoonPhaseAngle(astronomyData.sunEclipticLongitude, astronomyData.moonEclipticLongitude) : 0,
  [astronomyData]);

  const moonPhaseDescription = useMemo(() => 
    getMoonPhaseDescription(moonPhaseAngle),
  [moonPhaseAngle]);

  const formattedCoordinates = useMemo(() => {
    if (!coordinates) return "Laden...";
    return `Breitengrad: ${formatNumber(coordinates.latitude)}°, Längengrad: ${formatNumber(coordinates.longitude)}°`;
  }, [coordinates]);

  return (
    <div className="relative">
      <div className="absolute inset-0 z-0">
        {/* Hier wird der animierte Hintergrund eingefügt */}
      </div>
      <div className="relative z-10 p-4 bg-white rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Astronomische Daten</h2>

        <Geolocation onCoordinatesLoaded={handleCoordinatesLoaded} />

        {loading || !astronomyData ? (
          <p>Laden...</p>
        ) : (
          <ul>
            <li>Sonnenekliptik: {formattedAstronomyData.sunEclipticLongitude}°</li>
            <li>Mondekliptik: {formattedAstronomyData.moonEclipticLongitude}°</li>
            <li>Mondbeleuchtung: {formattedAstronomyData.moonIllumination}%</li>
            <li>Mondentfernung: {formattedAstronomyData.moonDistance} km</li>
            <li>Sonnenentfernung: {formattedAstronomyData.sunDistance} km</li>
            <li>Mondphase-Winkel: {moonPhaseAngle.toFixed(2)}°</li>
            <li>Mondphase: {moonPhaseDescription}</li>
            <li>Datum: {formattedAstronomyData.date}</li>
            <li>Aktuelle Zeit: {formattedAstronomyData.currentTime}</li>
            <li>Sonnenaufgang: {formattedAstronomyData.sunrise}</li>
            <li>Sonnenuntergang: {formattedAstronomyData.sunset}</li>
            <li>Sonnenstatus: {formattedAstronomyData.sunStatus}</li>
            <li>Sonnenmittag: {formattedAstronomyData.solarNoon}</li>
            <li>Tageslänge: {formattedAstronomyData.dayLength}</li>
            <li>Mondaufgang: {formattedAstronomyData.moonrise}</li>
            <li>Monduntergang: {formattedAstronomyData.moonset}</li>
            <li>Adresse: <br /> 
            {formattedAstronomyData.street} {formattedAstronomyData.houseNumber} <br />
            {formattedAstronomyData.postcode} {formattedAstronomyData.city} <br />
            {formattedAstronomyData.quarter} <br />
            {formattedAstronomyData.country} </li>
            <li>Koordinaten: {formattedCoordinates}</li>
            <li>Mondphase: {formattedAstronomyData.moonPhase}</li>
            <li>Mondentfernung (AU): {formattedAstronomyData.moonDistanceAU}</li>
            <li>Mondentfernung (km): {formattedAstronomyData.moonDistanceKM}</li>
            <li>Mondhöhe: {formattedAstronomyData.moonAltitude}</li>
            <li>Mondazimut: {formattedAstronomyData.moonAzimuth}</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export const getSunEclipticLongitude = (astronomyData: DatasProps["initialAstronomyData"] | null) => {
  return astronomyData ? astronomyData.sunEclipticLongitude : null;
};

export default Datas;
