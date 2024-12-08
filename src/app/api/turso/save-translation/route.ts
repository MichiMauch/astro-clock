import { NextResponse } from "next/server";
import db from "@/utils/db";

export async function POST(req: Request) {
  try {
    // Anfrage-Daten lesen
    const body = await req.json();
    const { date, text_original, text_translated } = body;

    // Validierung
    if (!date || !text_original || !text_translated) {
      return NextResponse.json(
        { error: "Alle Felder (date, text_original, text_translated) sind erforderlich." },
        { status: 400 }
      );
    }

    // SQL-Abfrage direkt mit Werten ausführen
    const query = `
      INSERT INTO image_desc_translations (date, text_original, text_translated) 
      VALUES ('${date}', '${text_original}', '${text_translated}')
    `;
    const result = await db.execute(query);

    return NextResponse.json({ 
      message: "Übersetzung erfolgreich gespeichert.", 
      result 
    });
  } catch (error) {
    console.error("Fehler beim Speichern der Übersetzung:", error);
    return NextResponse.json(
      { error: "Fehler beim Speichern der Übersetzung." },
      { status: 500 }
    );
  }
}
