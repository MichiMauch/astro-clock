import { useState, useEffect } from "react";

const useEarthImage = () => {
  const [imageUrlList, setImageUrlList] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getYesterdayDate = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0]; // ISO-Format jjjj-mm-tt
  };

  const [inputDate, setInputDate] = useState<string>(getYesterdayDate());
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
    fetchImagesByDate(inputDate);
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
      }, 1000); // Alle 500ms wechseln

      return () => clearInterval(interval); // Cleanup, wenn Komponente unmountet
    }
  }, [imagesPreloaded, imageUrlList]);

  return {
    imageUrlList,
    loading,
    error,
    inputDate,
    setInputDate,
    currentIndex,
    imagesPreloaded,
    handleFetchImages,
  };
};

export default useEarthImage;