import React, { useState, useEffect } from "react";

const ApodImage = () => {
  interface ApodData {
    title: string;
    url: string;
    media_type: string;
    explanation: string;
  }

  const [imageData, setImageData] = useState<ApodData | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [translatedText] = useState<string | null>(null);

  useEffect(() => {
    const fetchApodImage = async () => {
      try {
        // 1. APOD Daten abrufen
        const response = await fetch("/api/nasa-image");
        if (!response.ok) {
          throw new Error(`Error fetching APOD: ${response.status}`);
        }

        const data = await response.json();
        setImageData(data);

        // Logge die erhaltenen APOD-Daten
        console.log("APOD data fetched:", data);

        // Deaktiviere die automatische Übersetzung
        /*
        if (data.explanation) {
          // 2. Übersetzung und Speicherung der Beschreibung
          const translationRequestBody = {
            text: data.explanation,
            date: new Date().toISOString().split("T")[0],
            title: data.title,
          };

          // Logge den Request-Body für die Übersetzung
          console.log(
            "Request Body for translate-and-save:",
            translationRequestBody
          );

          const translationResponse = await fetch("/api/translate-and-save", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(translationRequestBody),
          });

          if (!translationResponse.ok) {
            throw new Error("Error translating and saving explanation.");
          }

          const { translatedText, translatedTitle } =
            await translationResponse.json();

          // Logge die übersetzte Antwort
          console.log("Translated Text Response:", translatedText);
          console.log("Translated Title Response:", translatedTitle);

          setTranslatedText(translatedText);
        }
        */
      } catch (error) {
        // Logge Fehler
        console.error("Error fetching APOD or translating:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          setError(error.message);
        }
      }
    };

    fetchApodImage();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!imageData) {
    return <p>Loading image...</p>;
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-start bg-black rounded-lg p-8 gap-8">
      <div className="w-full md:w-1/2 flex-shrink-0">
        {imageData.media_type === "image" ? (
          <img
            src={imageData.url}
            alt={imageData.title}
            className="rounded-lg shadow-md max-w-full h-auto"
          />
        ) : (
          <iframe
            src={imageData.url}
            title={imageData.title}
            className="rounded-lg shadow-md w-full h-auto"
          />
        )}
      </div>
      <div className="w-full md:w-1/2 text-gray-300">
        <p className="text-sm mb-2">NASA Astronomy Picture of the day</p>
        <h1 className="text-2xl font-bold mb-4 font-dmmono underline decoration-dotted">
          {showTranslation && translatedTitle
            ? translatedTitle
            : imageData.title}
        </h1>
        {showTranslation && translatedText ? (
          <div>
            <p>{translatedText}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowTranslation(false)}
            >
              Show Original
            </button>
          </div>
        ) : (
          <div>
            <p>{imageData.explanation}</p>
            {/*
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => setShowTranslation(true)}
            >
              Show Translation
            </button>
            */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApodImage;
