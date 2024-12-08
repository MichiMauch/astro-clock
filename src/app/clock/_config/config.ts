export const clockConfig = {
  colors: {
    faceFill1: "#000000", // Außenkreis
    faceStroke1: "#ffffff", // Außenkreis
    faceFill2: "#000000", // zweiter Kreis
    faceStroke2: "#ffffff", // zweiter Kreis
    faceFill3: "#000000", // dritter Kreis
    faceStroke3: "#ffffff", // dritter Kreis
    faceFill4: "#000000", // vierter Kreis
    faceStroke4: "#ffffff", // vierter Kreis
    faceFill5: "#000000", // fünfter Kreis
    faceStroke5: "#ffffff", // fünfter Kreis
    dayColor: "#ffffff", // Farbe der Zahlen
    currentDayMonthColor: "gold", // Farbe des aktuellen Monats
    hourColor: "#ffffff", // Normale Farbe für Stunden
    currentHourColor: "#gold", // Farbe für die aktuelle Stunde
    handhourColor: "#ffffff", // Farbe des Zeigers
    zodiacPointerColor: "#ffffff", // Farbe des Zeigers
    circleStroke: "black", // Farbe des Minutenkreisrahmens
    minuteHand: "black", // Farbe des Minutenzeigers
    secondHand: "red", // Farbe des Sekundenzeigers
    secondHandDot: "red", // Farbe des roten Punktes am Sekundenzeiger
    moonPhaseFill: "#000000", // Füllfarbe des Kreises
    moonPhaseStroke: "#ffffff", // Rahmenfarbe des Kreises
    moonPointerColor: "gold", // Farbe des Mondphasenzeigers
    earthOrbitColor: "gray", // Farbe der Umlaufbahn

  },
  sizes: {
    faceRadius1: "48%", // Radius des Zifferblatts 1
    faceRadius2: "42%", // Radius des Zifferblatts 2
    faceRadius3: "36.5%", // Radius des Zifferblatts 3
    faceRadius4: "32%", // Radius des Zifferblatts 4
    faceRadius5: "24.3%", // Radius des Zifferblatts 5
    centerRadius: "2%", // Größe des Mittelpunktes
    dayFontSize: "15%", // Schriftgröße der Zahlen
    currentDayFontSize: "15%", // Schriftgröße des aktuellen Monats
    hourFontSize: "15%", // Schriftgröße für normale Stunden
    currentHourFontSize: "15%", // Größere Schriftgröße für die aktuelle Stunde
    handhourWidth: 0.8, // Dicke des Zeigers
    secondHandDot: 0.8, // Radius des roten Punktes am Sekundenzeiger (in Prozent)


  },
  strokeWidths: {
    face1: 1, // Liniendicke des Außenkreises 1
    face2: 0.5,  // Liniendicke des Außenkreises 2
    face3: 0.5,  // Liniendicke des Außenkreises 3
    face4: 0.5,  // Liniendicke des Außenkreises 4
    face5: 0.5,  // Liniendicke des Außenkreises 4
    zodiacPointer: 0.8, // Liniendicke des Zeigers
    moonPointer: 1, // Liniendicke des MondphasenZeigers
    circleStroke: 0.5, // Dicke des Minutenkreisrahmens
    minuteHand: 0.6, // Dicke des Minutenzeigers
    secondHand: 0.2, // Dicke des Sekundenzeigers
    moonPhase: 0.5, // Breite des Rahmens für den Kreis
    earthOrbit: 0.5, // Dicke der Umlaufbahn


  },
  styles: {
    currentMonthFontWeight: "bold", // Schriftgewicht des aktuellen Monats
    defaultMonthFontWeight: "normal", // Standard-Schriftgewicht
    handLinecap: "round", // Abgerundetes Ende des Zeigers
    zodiacPointerCap: "round", // Ende des Zeigers
    moonPointerCap: "round", // Ende des Mondphasenzeigers
    minuteHandCap: "round", // Ende des Minutenzeigers
    secondHandCap: "round", // Ende des Sekundenzeigers

  },
  lengths: {
    zodiacPointer: 0.8, // Länge des Tierkreiszeigers
    moonPointer: 0.8, // Länge des Mondphasenzeigers
  },
};
