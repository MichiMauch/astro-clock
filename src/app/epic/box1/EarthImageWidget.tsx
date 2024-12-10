"use client";
import React, { useEffect } from "react";
import useEarthImage from "../_components/useEarthImage"; // Importiere den neuen Hook

const EarthImageWidget: React.FC = () => {
  const {
    imageUrlList,
    loading,
    error,
    inputDate,
    setInputDate,
    currentIndex,
    imagesPreloaded,
    handleFetchImages,
  } = useEarthImage();

  useEffect(() => {
    handleFetchImages();
  }, []);

  return (
    <div className="flex flex-col md:flex-row justify-center items-start bg-black rounded-lg p-8 gap-8">
      <div className="w-full md:w-1/2 text-gray-300">
        <p className="text-sm mb-2">Earth Polychromatic Imaging Camera</p>
        <h1 className="text-2xl font-bold mb-4 font-dmmono underline decoration-dotted">
          Earth Images from DSCOVR: EPIC
        </h1>
        <div className="mb-4 flex flex-col justify-center items-center">
          <p>
            The Deep Space Climate Observatory (DSCOVR) is a satellite that
            observes Earth and the Sun from a unique perspective. Positioned at
            Lagrange Point 1 (L1), approximately 1.5 million kilometers away
            from Earth towards the Sun, it continuously monitors the sunlit side
            of the Earth while collecting vital data on space weather. DSCOVR
            and its Earth Polychromatic Imaging Camera (EPIC) are not just
            scientific tools but also symbols of the beauty and fragility of our
            planet.
          </p>
          <p className="pt-4">
            Here, you can select any day and see how Earth looked on that date
            as captured by the EPIC camera aboard the DSCOVR satellite from
            space. The images show the sunlit side of Earth from a distance of
            1.5 million kilometers, offering an awe-inspiring perspective of our
            planet.
          </p>
        </div>
        <div className="flex items-center">
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
            Get your Earth image
          </button>
        </div>
        {/* Fehler oder Ladeanzeige */}
        {loading && (
          <p className="text-blue-500">Loading your earth images...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <div className="w-full md:w-1/2 flex-shrink-0">
        {/* Animiertes Bild */}
        {imagesPreloaded && imageUrlList.length > 0 && !loading && !error && (
          <div className="relative w-full h-auto flex flex-col justify-center items-center">
            <img
              src={imageUrlList[currentIndex]}
              alt={`Earth Image ${currentIndex + 1}`}
              className="w-3/4 max-w-md h-auto rounded shadow-md"
            />
            <p className="text-gray-300 mt-4">Your earth from {inputDate}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EarthImageWidget;
