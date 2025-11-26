export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { contents } = req.body;

    if (!contents) {
      return res.status(400).json({ error: "Missing 'contents' in request body" });
    }

    // Send request to Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: data.error || "Gemini API error" });
    }

    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: "Internal server error: " + err.message });
  }
}
