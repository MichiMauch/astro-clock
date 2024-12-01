"use client";

import { useEffect, useState } from "react";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeolocationProps {
  onCoordinatesLoaded: (coordinates: Coordinates) => void;
}

const Geolocation: React.FC<GeolocationProps> = ({ onCoordinatesLoaded }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation wird von diesem Browser nicht unterstützt.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        onCoordinatesLoaded(coordinates);
      },
      () => {
        setError("Geolocation wurde abgelehnt. Bitte Standortzugriff aktivieren.");
      }
    );
  }, [onCoordinatesLoaded]);

  if (error) {
    return (
      <div className="text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return null;
};

export default Geolocation;
