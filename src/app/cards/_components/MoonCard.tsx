import React from "react";

const MoonCard: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: "10%",
        width: "20%",
        height: "50%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
      className="moon-card"
    >
      <p className="text-center text-xl">Informationen zur Uhr</p>
    </div>
  );
};

export default MoonCard;