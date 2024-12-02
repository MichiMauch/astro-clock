export async function GET() {
    return new Response("Test funktioniert!", {
      headers: { "Content-Type": "text/plain" },
    });
  }
  