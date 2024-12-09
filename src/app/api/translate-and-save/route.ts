import { NextResponse } from "next/server";
import turso from "@/utils/db"; // Stelle sicher, dass dein Turso-Client korrekt konfiguriert ist.

export async function POST(req: Request) {
  const { OPENAI_API_KEY } = process.env;

  if (!OPENAI_API_KEY) {
    console.error("OpenAI API key not configured");
    return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 });
  }

  const body = await req.json();
  // Logge den empfangenen Request-Body
  console.log("Received Request Body:", body);

  const { text, date, title } = body;

  if (!text || !date || !title) {
    console.error("Text, date, and title are required for translation");
    return NextResponse.json({ error: "Text, date, and title are required for translation" }, { status: 400 });
  }

  try {
    // Überprüfen, ob bereits eine Übersetzung für das Bild vorhanden ist
    console.log("Checking for existing translation...");
    const existingTranslationResult = await turso.execute({
      sql: "SELECT * FROM image_desc_translations WHERE date = ? AND text_original = ?",
      args: [date, text]
    });

    const existingTranslation = existingTranslationResult.rows;
    console.log("Existing Translation Result:", existingTranslation);

    if (existingTranslation.length > 0) {
      console.log("Translation already exists");
      return NextResponse.json({
        message: "Translation already exists.",
        translatedText: existingTranslation[0].text_translated,
        translatedTitle: existingTranslation[0].title_translated,
      });
    }

    // Übersetzen des Textes mit OpenAI
    console.log("Translating text with OpenAI...");
    const fetchWithTimeout = async (resource: string, options: RequestInit, timeout: number) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id);
      return response;
    };

    const textResponse = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a translator from English to German." },
          { role: "user", content: `Translate this text into German:\n\n${text}` },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    }, 10000); // 10 Sekunden Timeout

    if (!textResponse.ok) {
      console.error(`OpenAI API request failed: ${textResponse.status}`);
      throw new Error(`OpenAI API request failed: ${textResponse.status}`);
    }

    const textData = await textResponse.json();
    console.log("OpenAI API text response data:", textData);

    if (!textData.choices || textData.choices.length < 1) {
      throw new Error("Unexpected response format from OpenAI API for text");
    }

    const translatedText = textData.choices[0].message.content;

    // Übersetzen des Titels mit OpenAI
    console.log("Translating title with OpenAI...");
    const titleResponse = await fetchWithTimeout("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a translator from English to German." },
          { role: "user", content: `Translate this title into German:\n\n${title}` },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    }, 10000); // 10 Sekunden Timeout

    if (!titleResponse.ok) {
      console.error(`OpenAI API request failed: ${titleResponse.status}`);
      throw new Error(`OpenAI API request failed: ${titleResponse.status}`);
    }

    const titleData = await titleResponse.json();
    console.log("OpenAI API title response data:", titleData);

    if (!titleData.choices || titleData.choices.length < 1) {
      throw new Error("Unexpected response format from OpenAI API for title");
    }

    const translatedTitle = titleData.choices[0].message.content;

    // Logge die übersetzten Texte
    console.log("Translated Text:", translatedText);
    console.log("Translated Title:", translatedTitle);

    // Übersetzung in der Datenbank speichern
    console.log("Saving translation to database...");
    await turso.execute({
      sql: "INSERT INTO image_desc_translations (date, text_original, text_translated, title_original, title_translated) VALUES (?, ?, ?, ?, ?)",
      args: [date, text, translatedText, title, translatedTitle]
    });

    console.log("Translation saved successfully");
    return NextResponse.json({
      message: "Translation saved successfully.",
      translatedText,
      translatedTitle,
    });
  } catch (error) {
    console.error("Error translating and saving text and title:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
    }
    return NextResponse.json({ error: "Translation and saving failed" }, { status: 500 });
  }
}
