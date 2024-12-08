export async function GET() {
    const { NASA_API_KEY } = process.env;
  
    if (!NASA_API_KEY) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    try {
      const response = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`
      );
  
      if (!response.ok) {
        throw new Error(`Failed to fetch APOD: ${response.statusText}`);
      }
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error fetching APOD:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch APOD" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }
  