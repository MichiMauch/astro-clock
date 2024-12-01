// moonPhaseHelper.ts
export const calculateMoonPhaseAngle = (sunEclipticLongitude: number, moonEclipticLongitude: number): number => {
    return ((moonEclipticLongitude - sunEclipticLongitude + 360) % 360);
  };
  
  export const getMoonPhaseDescription = (moonPhaseAngle: number): string => {
    if (moonPhaseAngle === 0) return "Neumond: Der Mond ist unsichtbar.";
    if (moonPhaseAngle > 0 && moonPhaseAngle < 90) return "Zunehmende Sichel: Der Mond wächst langsam.";
    if (moonPhaseAngle === 90) return "Erstes Viertel: Der Mond ist zur Hälfte beleuchtet.";
    if (moonPhaseAngle > 90 && moonPhaseAngle < 180) return "Zunehmender Mond: Der Mond ist fast voll.";
    if (moonPhaseAngle === 180) return "Vollmond: Der Mond ist komplett beleuchtet.";
    if (moonPhaseAngle > 180 && moonPhaseAngle < 270) return "Abnehmender Mond: Der Mond nimmt ab.";
    if (moonPhaseAngle === 270) return "Letztes Viertel: Der Mond ist zur Hälfte beleuchtet.";
    if (moonPhaseAngle > 270 && moonPhaseAngle < 360) return "Abnehmende Sichel: Der Mond verschwindet langsam.";
    return "Unbekannt: Die Phase konnte nicht bestimmt werden.";
  };
  