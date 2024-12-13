"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface IssData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

interface IssMapProps {
  data: IssData | null;
  orbitPath: [number, number][];
}

const ISS_ICON = new L.Icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg",
  iconSize: [50, 32],
  iconAnchor: [25, 16],
});

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

export default function IssMap({ data, orbitPath }: IssMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [0, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false,
        worldCopyJump: false,
        zoomSnap: 0.1,
        maxBounds: [
          [-90, -200],
          [90, 200],
        ],
        maxBoundsViscosity: 1.0,
        minZoom: 1,
        maxZoom: 6,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        noWrap: false,
        bounds: [
          [-90, -200],
          [90, 200],
        ],
        tileSize: 256,
        zoomOffset: 0,
      }).addTo(map);

      L.control
        .attribution({
          position: "bottomleft",
        })
        .addTo(map);

      L.control
        .zoom({
          position: "topright",
        })
        .addTo(map);

      mapRef.current = map;
      setMapReady(true);

      // Anpassen der Kartengröße, um das Seitenverhältnis beizubehalten
      const containerWidth = mapContainerRef.current.offsetWidth;
      const containerHeight = mapContainerRef.current.offsetHeight;
      const aspectRatio = containerWidth / containerHeight;
      const maxAspectRatio = 16 / 9; // Gewünschtes Seitenverhältnis, z.B. 16:9

      if (aspectRatio > maxAspectRatio) {
        mapContainerRef.current.style.height = "100%";
        mapContainerRef.current.style.width = `${
          containerHeight * maxAspectRatio
        }px`;
      } else {
        mapContainerRef.current.style.width = "100%";
        mapContainerRef.current.style.height = `${
          containerWidth / maxAspectRatio
        }px`;
      }

      map.invalidateSize();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && mapReady && data) {
      const { latitude, longitude } = data;

      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current?.removeLayer(layer);
        }
      });

      L.marker([latitude, longitude], { icon: ISS_ICON }).addTo(mapRef.current)
        .bindPopup(`
          <strong>Latitude:</strong> ${latitude.toFixed(2)}<br>
          <strong>Longitude:</strong> ${longitude.toFixed(2)}<br>
          <strong>Altitude:</strong> ${data.altitude.toFixed(2)} km<br>
          <strong>Velocity:</strong> ${data.velocity.toFixed(2)} km/h
        `);

      const validOrbitPath = orbitPath.filter(
        ([lat, lon]) => lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
      );

      const segments = splitOrbitPath(validOrbitPath);

      segments.forEach((segment) => {
        L.polyline(segment, {
          color: "red",
          weight: 2,
          opacity: 0.7,
        }).addTo(mapRef.current!);
      });
    }
  }, [data, orbitPath, mapReady]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-screen relative overflow-hidden"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}
