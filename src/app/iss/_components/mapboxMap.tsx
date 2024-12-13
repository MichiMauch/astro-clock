"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

interface MapboxMapProps {
  data: { latitude: number; longitude: number } | null;
  orbitPath: [number, number][];
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

  useEffect(() => {
    if (typeof window === "undefined") return;

    const initializeMap = () => {
      if (mapContainerRef.current && !mapRef.current) {
        console.log("Initializing map...");
        const map = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v11",
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

        return () => {
          map.remove();
        };
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
      const existingMarker = mapRef.current.getLayer("iss-marker");
      if (existingMarker) {
        mapRef.current.removeLayer("iss-marker");
        mapRef.current.removeSource("iss-marker");
      }

      // Add new marker
      mapRef.current.addSource("iss-marker", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          properties: {},
        },
      });

      mapRef.current.addLayer({
        id: "iss-marker",
        type: "circle",
        source: "iss-marker",
        paint: {
          "circle-radius": 10,
          "circle-color": "#FF0000",
        },
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
      className="w-full h-[500px] relative overflow-hidden"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!mapLoaded && <div>Loading map...</div>}
    </div>
  );
}
