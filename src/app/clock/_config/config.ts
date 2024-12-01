export const clockConfig = {
  colors: {
    faceFill1: "#ffffff", // Außenkreis
    faceStroke1: "#000000", // Außenkreis
    faceFill2: "#ffffff", // zweiter Kreis
    faceStroke2: "#000000", // zweiter Kreis
    faceFill3: "#ffffff", // dritter Kreis
    faceStroke3: "#000000", // dritter Kreis
    faceFill4: "#ffffff", // vierter Kreis
    faceStroke4: "#000000", // vierter Kreis
    faceFill5: "#ffffff", // fünfter Kreis
    faceStroke5: "#000000", // fünfter Kreis
    dayColor: "#000000", // Farbe der Zahlen
    currentDayMonthColor: "#FF0000", // Farbe des aktuellen Monats
    hourColor: "#000000", // Normale Farbe für Stunden
    currentHourColor: "#ff0000", // Farbe für die aktuelle Stunde
    handhourColor: "#ff0000", // Farbe des Zeigers
    zodiacPointerColor: "#000000", // Farbe des Zeigers
    circleStroke: "black", // Farbe des Minutenkreisrahmens
    minuteHand: "black", // Farbe des Minutenzeigers
    secondHand: "red", // Farbe des Sekundenzeigers
    secondHandDot: "red", // Farbe des roten Punktes am Sekundenzeiger
    moonPhaseFill: "#ffffff", // Füllfarbe des Kreises
    moonPhaseStroke: "#000000", // Rahmenfarbe des Kreises
    moonPointerColor: "gold", // Farbe des Mondphasenzeigers

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
    handhourWidth: "1", // Dicke des Zeigers
    secondHandDot: 0.8, // Radius des roten Punktes am Sekundenzeiger (in Prozent)


  },
  strokeWidths: {
    face1: 1, // Liniendicke des Außenkreises 1
    face2: 0.5,  // Liniendicke des Außenkreises 2
    face3: 0.5,  // Liniendicke des Außenkreises 3
    face4: 0.5,  // Liniendicke des Außenkreises 4
    face5: 0.5,  // Liniendicke des Außenkreises 4
    zodiacPointer: 0.5, // Liniendicke des Zeigers
    moonPointer: 1, // Liniendicke des MondphasenZeigers
    circleStroke: 0.5, // Dicke des Minutenkreisrahmens
    minuteHand: 0.6, // Dicke des Minutenzeigers
    secondHand: 0.2, // Dicke des Sekundenzeigers
    moonPhase: 0.5, // Breite des Rahmens für den Kreis


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
