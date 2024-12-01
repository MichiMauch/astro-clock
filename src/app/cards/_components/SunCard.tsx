import React from "react";

const SunCard: React.FC = () => {
  return (
    <div
      style={{
        position: "absolute",
        right: "10%",
        width: "20%",
        height: "50%",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
      className="sun-card"
    >
      <p className="text-center text-xl">Zusätzliche Informationen</p>
    </div>
  );
};

export default SunCard;