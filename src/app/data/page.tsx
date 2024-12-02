import { getCombinedAstronomyData } from "@/services/dataAggregator";
import Datas from "@/components/Datas";

export default async function ClockPage() {
  const initialAstronomyData = await getCombinedAstronomyData();

  if (!initialAstronomyData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-600">Fehler beim Laden der Daten</h1>
      </div>
    );
  }

  const formattedAstronomyData = {
    ...initialAstronomyData,
    moonDistanceAU: initialAstronomyData.moonDistanceAU || 0, // Ensure moonDistanceAU is defined
    moonDistanceKM: initialAstronomyData.moonDistanceKM || 0, // Ensure moonDistanceKM is defined
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Astronomische Daten</h1>
      <Datas initialAstronomyData={formattedAstronomyData} />
    </main>
  );
}
