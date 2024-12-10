import { useEffect, useState, createContext, ReactNode } from "react";
import { calculateOrbit } from "../../../utils/orbit";

interface IssData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
}

interface IssContextProps {
  data: IssData | null;
  orbitPath: [number, number][];
  error: string | null;
}

export const IssContext = createContext<IssContextProps>({
  data: null,
  orbitPath: [],
  error: null,
});

const IssDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<IssData | null>(null);
  const [orbitPath, setOrbitPath] = useState<[number, number][]>([]);
  const [error, setError] = useState<string | null>(null);

  const fixOrbitPath = (path: [number, number][]): [number, number][] => {
    const fixedPath: [number, number][] = [];
    for (let i = 0; i < path.length - 1; i++) {
      const [lat1, lon1] = path[i];
      const [lat2, lon2] = path[i + 1];

      fixedPath.push([lat1, lon1]);

      if (Math.abs(lon2 - lon1) > 180) {
        if (lon2 > lon1) {
          fixedPath.push([lat1, 180]);
          fixedPath.push([lat2, -180]);
        } else {
          fixedPath.push([lat1, -180]);
          fixedPath.push([lat2, 180]);
        }
      }
    }

    fixedPath.push(path[path.length - 1]);

    return fixedPath.map(([lat, lon]) => [
      lat,
      lon > 180 ? lon - 360 : lon < -180 ? lon + 360 : lon,
    ]);
  };

  useEffect(() => {
    const updateOrbitPath = async () => {
      // Statische TLE-Daten
      const tleLines = [
        "1 25544U 98067A   24345.54333896  .00017806  00000+0  31407-3 0  9998",
        "2 25544  51.6364 161.6568 0007197 324.6090  35.4420 15.50446230485902",
      ];

      const orbit = calculateOrbit(tleLines);
      const formattedOrbitPath: [number, number][] = orbit.map(
        ({ latitude, longitude }) => [latitude, longitude]
      );

      const fixedOrbitPath = fixOrbitPath(formattedOrbitPath);
      setOrbitPath(fixedOrbitPath);
    };

    updateOrbitPath();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/iss");
        if (!response.ok) {
          throw new Error("Failed to fetch ISS data");
        }
        const rawData = await response.json();
        setData(rawData);
        setError(null);
      } catch {
        setError("Fehler beim Abrufen der ISS-Daten.");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <IssContext.Provider value={{ data, orbitPath, error }}>
      {children}
    </IssContext.Provider>
  );
};

export default IssDataProvider;
