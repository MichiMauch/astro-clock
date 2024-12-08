import { NextResponse } from "next/server";
import db from "@/utils/db";

export async function GET() {
  try {
    // Alle gespeicherten Übersetzungen abrufen
    const query = "SELECT * FROM image_desc_translations";
    const result = await db.execute(query);

    return NextResponse.json({ 
      message: "Übersetzungen erfolgreich abgerufen.", 
      data: result.rows 
    });
  } catch (error) {
    console.error("Fehler beim Abrufen der Übersetzungen:", error);
    return NextResponse.json(
      { error: "Fehler beim Abrufen der Übersetzungen." },
      { status: 500 }
    );
  }
}
