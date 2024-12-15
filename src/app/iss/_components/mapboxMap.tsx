"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { FiCrosshair } from "react-icons/fi";
import { createRoot } from "react-dom/client";

interface MapboxMapProps {
  data: { latitude: number; longitude: number } | null;
  orbitPath: [number, number][];
}

async function fetchMapboxToken() {
  try {
    const response = await fetch("/api/mapbox");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (!data.token) {
      throw new Error("Token not found in response");
    }
    return data.token;
  } catch (error) {
    console.error("Failed to fetch Mapbox token:", error);
    throw error;
  }
}

function splitOrbitPath(path: [number, number][]): [number, number][][] {
  const segments: [number, number][][] = [];
  let currentSegment: [number, number][] = [];

  for (let i = 0; i < path.length; i++) {
    currentSegment.push(path[i]);
    if (i < path.length - 1 && Math.abs(path[i][1] - path[i + 1][1]) > 180) {
      segments.push(currentSegment);
      currentSegment = [];
    }
  }

  if (currentSegment.length > 0) {
    segments.push(currentSegment);
  }

  return segments;
}

export default function MapboxMap({ data, orbitPath }: MapboxMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeMap = async () => {
      if (mapContainerRef.current && !mapRef.current) {
        console.log("Initializing map...");

        try {
          const token = await fetchMapboxToken();
          mapboxgl.accessToken = token;

          const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/standard-satellite",
            center: [0, 0],
            zoom: 1.5,
            maxBounds: [
              [-180, -90],
              [180, 90],
            ],
          });

          mapRef.current = map;

          map.on("load", () => {
            console.log("Map loaded successfully!");
            setMapLoaded(true);
            map.fitBounds([
              [-180, -90],
              [180, 90],
            ]);
          });

          map.on("error", (e) => {
            console.error("Mapbox error:", e.error);
          });
        } catch (error) {
          console.error("Failed to initialize map:", error);
        }
      }
    };

    const timer = setTimeout(initializeMap, 5000); // 5 Sekunden warten

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mapRef.current && mapLoaded) {
      const resizeHandler = () => {
        mapRef.current?.resize();
        mapRef.current?.fitBounds([
          [-180, -90],
          [180, 90],
        ]);
      };

      window.addEventListener("resize", resizeHandler);

      return () => {
        window.removeEventListener("resize", resizeHandler);
      };
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (mapRef.current && mapLoaded && data) {
      console.log("Updating ISS position...");
      const { latitude, longitude } = data;

      // Remove existing marker if any
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      const el = document.createElement("div");
      el.className = "iss-marker";
      const root = createRoot(el);
      root.render(<FiCrosshair size={24} color="#FF0000" />);

      markerRef.current = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(mapRef.current);

      // Center the map on the ISS position
      mapRef.current.flyTo({
        center: [longitude, latitude],
        essential: true, // This ensures the animation is considered essential with respect to prefers-reduced-motion
      });
    }
  }, [data, mapLoaded]);

  useEffect(() => {
    if (mapRef.current && mapLoaded && orbitPath.length > 0) {
      console.log("Updating orbit path...");
      const segments = splitOrbitPath(orbitPath);

      // Remove existing path if any
      const existingPath = mapRef.current.getLayer("orbit-path");
      if (existingPath) {
        mapRef.current.removeLayer("orbit-path");
        mapRef.current.removeSource("orbit-path");
      }

      // Add new path segments
      segments.forEach((segment, index) => {
        mapRef.current?.addSource(`orbit-path-${index}`, {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: segment.map(([lat, lon]) => [lon, lat]),
            },
          },
        });

        mapRef.current?.addLayer({
          id: `orbit-path-${index}`,
          type: "line",
          source: `orbit-path-${index}`,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#888",
            "line-width": 2,
          },
        });
      });
    }
  }, [orbitPath, mapLoaded]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] relative overflow-hidden rounded-lg"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        borderRadius: "0.5rem",
      }}
    >
      {!mapLoaded && <div>Loading map......</div>}
    </div>
  );
}
