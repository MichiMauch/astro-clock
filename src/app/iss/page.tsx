import IssData from "./_components/issData";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Startseite</h1>
      <p className="mb-6">Hier kannst du die ISS-Daten sehen:</p>
      <IssData />
    </div>
  );
}
