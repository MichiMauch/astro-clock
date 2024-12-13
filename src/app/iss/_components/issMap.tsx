"use client";

import { useEffect, useRef } from "react";
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

export default function IssMap({ data, orbitPath }: IssMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        noWrap: true,
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && data) {
      const { latitude, longitude } = data;

      // Entfernen Sie vorherige Marker und Polylines
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current?.removeLayer(layer);
        }
      });

      // Fügen Sie den ISS-Marker hinzu
      L.marker([latitude, longitude], { icon: ISS_ICON }).addTo(mapRef.current)
        .bindPopup(`
          <strong>Latitude:</strong> ${latitude.toFixed(2)}<br>
          <strong>Longitude:</strong> ${longitude.toFixed(2)}<br>
          <strong>Altitude:</strong> ${data.altitude.toFixed(2)} km<br>
          <strong>Velocity:</strong> ${data.velocity.toFixed(2)} km/h
        `);

      // Zeichnen Sie die Umlaufbahn
      const validOrbitPath = orbitPath.filter(
        ([lat, lon]) => lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
      );

      L.polyline(validOrbitPath, {
        color: "red",
        weight: 2,
        opacity: 0.7,
      }).addTo(mapRef.current);

      // Passen Sie die Kartenansicht an
      const bounds = L.latLngBounds(validOrbitPath);
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 3 });
    }
  }, [data, orbitPath]);

  return (
    <div
      ref={mapContainerRef}
      className="w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] rounded-lg shadow-md"
    />
  );
}
