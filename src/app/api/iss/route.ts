import { NextResponse } from 'next/server';

const ISS_API_URL = 'https://api.wheretheiss.at/v1/satellites/25544';

export async function GET() {
  try {
    const response = await fetch(ISS_API_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch ISS data from external API');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = (error instanceof Error) ? error.message : 'Unbekannter Fehler';
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    );
  }
}
