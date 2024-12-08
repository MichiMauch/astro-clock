"use client";
import React, { useState, useEffect } from "react";

const EarthImageWidget: React.FC = () => {
  const [imageUrlList, setImageUrlList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [inputDate, setInputDate] = useState<string>(""); // Eingabedatum im Format tt.mm.jjjj
  const [currentIndex, setCurrentIndex] = useState<number>(0); // Aktueller Index für die Animation
  const [imagesPreloaded, setImagesPreloaded] = useState<boolean>(false); // Status für vorgeladene Bilder

  // Bilder basierend auf Datum abrufen
  const fetchImagesByDate = async (formattedDate: string) => {
    try {
      setLoading(true);
      setError(null);
      setImagesPreloaded(false);

      const response = await fetch(`/api/epic?date=${formattedDate}`);

      if (!response.ok) {
        throw new Error(`Error fetching EPIC data: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const baseUrl = "https://epic.gsfc.nasa.gov/archive/natural";

        // URLs für die Bilder erstellen
        const urls = data.map((item: { date: string; image: string }) => {
          const imageDate = item.date.split(" ")[0].replaceAll("-", "/");
          return `${baseUrl}/${imageDate}/png/${item.image}.png`;
        });

        setImageUrlList(urls);
        setCurrentIndex(0); // Animation von vorne starten
        preloadImages(urls); // Bilder vorladen
      } else {
        setError("No images available for the selected date.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load images for the selected date.");
    } finally {
      setLoading(false);
    }
  };

  // Datum validieren und Bilder abrufen
  const handleFetchImages = () => {
    const dateParts = inputDate.split(".");
    if (dateParts.length === 3) {
      const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Format zu jjjj-mm-tt konvertieren
      fetchImagesByDate(formattedDate);
    } else {
      setError("Invalid date format. Please use tt.mm.jjjj.");
    }
  };

  // Bilder vorladen
  const preloadImages = async (urls: string[]) => {
    const preload = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
      });

    await Promise.all(urls.map((url) => preload(url)));
    setImagesPreloaded(true); // Nach dem Vorladen Status aktualisieren
  };

  // Animation für die Bilder
  useEffect(() => {
    if (imagesPreloaded && imageUrlList.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % imageUrlList.length); // Nächster Index, zyklisch
      }, 300); // Alle 500ms wechseln

      return () => clearInterval(interval); // Cleanup, wenn Komponente unmountet
    }
  }, [imagesPreloaded, imageUrlList]);

  return (
    <div className="text-center z-10 p-4">
      <h2 className="text-lg font-bold mb-4">Earth Image Widget</h2>

      {/* Eingabefeld für Datum */}
      <div className="mb-4 flex justify-center items-center">
        <input
          type="text"
          placeholder="tt.mm.jjjj"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
          className="border border-gray-300 p-2 rounded w-60 text-center shadow-sm focus:ring focus:ring-blue-300"
        />
        <button
          onClick={handleFetchImages}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:ring focus:ring-blue-300"
        >
          Fetch Images
        </button>
      </div>

      {/* Fehler oder Ladeanzeige */}
      {loading && <p className="text-blue-500">Loading images...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Animiertes Bild */}
      {imagesPreloaded && imageUrlList.length > 0 && !loading && !error && (
        <div className="mt-4 relative w-full h-auto">
          <img
            src={imageUrlList[currentIndex]}
            alt={`Earth Image ${currentIndex + 1}`}
            className="w-full h-auto rounded shadow-md"
          />
        </div>
      )}
    </div>
  );
};

export default EarthImageWidget;
