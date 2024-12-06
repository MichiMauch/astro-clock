import fetch from 'node-fetch';

export async function GET(): Promise<Response> {
  const imageUrl = "https://fourmilab.ch/cgi-bin/Earth?img=learth&opt=-l&dynimg=y&alt=150000000&date=0&imgsize=300&ns=North&ew=East&lat=45.9&lon=8.32";
                    
  try {
    // Hole das Bild von der Original-URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Fehler beim Abrufen des Erdbildes: ${response.statusText}`);
    }

    // Leite das Bild mit den richtigen Headers weiter
    const buffer = await response.buffer();
    return new Response(buffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Access-Control-Allow-Origin': '*', // CORS erlauben
      },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen des Erdbildes:", error);
    return new Response('Fehler beim Abrufen des Erdbildes', { status: 500 });
  }
}
