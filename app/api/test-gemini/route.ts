// Temporary debug endpoint — DELETE after fixing Gemini issue
export async function GET() {
  const key = process.env.GEMINI_API_KEY;

  if (!key) {
    return Response.json({ error: "GEMINI_API_KEY not set in environment" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          contents: [{ parts: [{ text: "Say hello in one word" }] }]
        }),
      }
    );

    const body = await res.json();

    return Response.json({
      http_status: res.status,
      ok:          res.ok,
      key_prefix:  key.slice(0, 8) + "...",
      gemini_response: body,
    });
  } catch (e) {
    return Response.json({
      error:      String(e),
      key_prefix: key ? key.slice(0, 8) + "..." : "not set",
    }, { status: 500 });
  }
}
