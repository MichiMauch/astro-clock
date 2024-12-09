import React from "react";
import EarthImageGallery from "./box1/EarthImageWidget";

const Home: React.FC = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Earth Image Viewer</h1>
      <EarthImageGallery />
    </main>
  );
};

export default Home;
