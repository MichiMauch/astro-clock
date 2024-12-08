import { createClient } from "@libsql/client";

const url = process.env.TURSO_DATABASE_URL; // Datenbank-URL aus der .env-Datei
const token = process.env.TURSO_API_TOKEN; // API-Token aus der .env-Datei

if (!url || !token) {
  throw new Error("Turso-Datenbank-URL oder API-Token fehlt in der .env-Datei.");
}

const db = createClient({ url, authToken: token });

export default db;
