import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        // Füge benötigte Headers hinzu, wenn nötig
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch the URL: ${response.statusText}` },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("Content-Type") || "application/octet-stream";

    // Weiterleitung des Bildes
    return new NextResponse(await response.arrayBuffer(), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching proxy URL:", error);
    return NextResponse.json(
      { error: "Failed to fetch the requested URL" },
      { status: 500 }
    );
  }
}
