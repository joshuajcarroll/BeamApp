import { NextRequest, NextResponse } from "next/server";

const DEEPL_API_KEY = process.env.DEEPL_API_KEY!; // set in .env
const DEEPL_ENDPOINT = "https://api-free.deepl.com/v2/translate"; // or paid endpoint

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const to = (req.nextUrl.searchParams.get("to") || "en").toUpperCase(); // e.g. "EN"
  if (!q) return NextResponse.json({ error: "Missing q" }, { status: 400 });

  try {
    const body = new URLSearchParams({ text: q, target_lang: to });
    const r = await fetch(DEEPL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });

    if (!r.ok) {
      // Soft-fallback to original text if service hiccups
      return NextResponse.json(
        { text: q, note: "deepl_error" },
        { status: 200 }
      );
    }

    const json = await r.json();
    const text = json?.translations?.[0]?.text ?? q;
    return NextResponse.json({ text });
  } catch {
    return NextResponse.json(
      { text: q, note: "deepl_exception" },
      { status: 200 }
    );
  }
}
