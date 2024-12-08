import { NextResponse } from "next/server";
import db from "@/utils/db"; // Stelle sicher, dass der Pfad zu deiner Datenbankverbindung korrekt ist

export async function GET() {
  try {
    const result = await db.execute("SELECT 1 AS success");
    return NextResponse.json({ message: "Verbindung erfolgreich", result });
  } catch (error) {
    console.error("Fehler bei der Verbindung zur Datenbank:", error);
    return NextResponse.json({ error: "Fehler bei der Verbindung zur Datenbank" }, { status: 500 });
  }
}
