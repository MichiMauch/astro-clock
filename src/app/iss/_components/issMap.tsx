"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface IssData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

interface IssMapProps {
  data: IssData | null; // ISS-Daten als Prop
  orbitPath: [number, number][]; // Umlaufbahn als Prop
}

const ISS_ICON = new L.Icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/d/d0/International_Space_Station.svg",
  iconSize: [50, 32],
  iconAnchor: [25, 16],
});

// Funktion, um die Karte dynamisch auf alle Koordinaten zu zentrieren
function FitBounds({ positions }: { positions: [number, number][][] }) {
  const map = useMap();

  // Kombiniere alle Positionen in ein einziges Array
  const allPositions = positions.flat();

  // Berechne die Bounds basierend auf allen Positionen
  if (allPositions.length > 0) {
    const bounds = L.latLngBounds(allPositions);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 3 });
  }

  return null;
}

export default function IssMap({ data, orbitPath }: IssMapProps) {
  console.log("Original Orbit Path in IssMap:", orbitPath);

  // Validierung der Umlaufbahnkoordinaten
  const validateCoordinates = (path: [number, number][]) => {
    return path.filter(
      ([lat, lon]) => lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180
    );
  };

  // Funktion, um die Übergänge über die -180/180-Grenze zu korrigieren
  const splitOrbitPath = (path: [number, number][]) => {
    const segments: [number, number][][] = [];
    let currentSegment: [number, number][] = [];

    for (let i = 0; i < path.length; i++) {
      const [lat, lon] = path[i];

      if (i > 0) {
        const [, prevLon] = path[i - 1];

        // Übergang erkennen: Differenz in der Länge > 180
        if (Math.abs(lon - prevLon) > 180) {
          console.log(
            `Übergang erkannt bei Index ${i}, Koordinaten: [${lat}, ${lon}]`
          );
          segments.push(currentSegment);
          currentSegment = [];
        }
      }

      currentSegment.push([lat, lon]);
    }

    segments.push(currentSegment);

    console.log("Orbit-Segmente vor Filterung:", segments);

    // Entferne Segmente, die nur einen Punkt enthalten
    return segments.filter((segment) => segment.length > 1);
  };

  // Validierte und gesplittete Orbit-Segmente
  const validOrbitPath = validateCoordinates(orbitPath);
  const orbitSegments = splitOrbitPath(validOrbitPath);

  console.log("Validated Orbit Path:", validOrbitPath);
  console.log("Split Orbit Segments:", orbitSegments);

  return (
    <div className="w-full h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] rounded-lg shadow-md">
      <MapContainer
        center={[0, 0]} // Anfangszentrum der Karte
        zoom={2} // Festgelegte Zoomstufe
        className="w-full h-full"
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        worldCopyJump={true} // Sicherstellen, dass die Weltkarte korrekt funktioniert
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          noWrap={true}
        />
        {/* Passe die Karte an alle Positionen der Umlaufbahn an */}
        <FitBounds positions={orbitSegments} />

        {/* Zeichne die Umlaufbahn */}
        {orbitSegments.map((segment, index) => (
          <Polyline
            key={index}
            positions={segment}
            color="red"
            weight={2}
            opacity={0.7}
          />
        ))}

        {/* Marker für die ISS */}
        {data && (
          <Marker position={[data.latitude, data.longitude]} icon={ISS_ICON}>
            <Popup>
              <div>
                <p>
                  <strong>Latitude:</strong> {data.latitude.toFixed(2)}
                </p>
                <p>
                  <strong>Longitude:</strong> {data.longitude.toFixed(2)}
                </p>
                <p>
                  <strong>Altitude:</strong> {data.altitude.toFixed(2)} km
                </p>
                <p>
                  <strong>Velocity:</strong> {data.velocity.toFixed(2)} km/h
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
