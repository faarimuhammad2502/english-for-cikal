const SUPABASE_URL = "https://rmmfiunormsowrjtochm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_EhUXw6fEVUXHMADdaxTdjw_Vxwnq1gK";
const limits = globalThis.__speakingLimits || (globalThis.__speakingLimits = new Map());

function reply(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return reply(res, 405, { error: "Metode ini tidak didukung." });
  const auth = req.headers.authorization || "";
  const token = auth.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) return reply(res, 401, { error: "Silakan masuk kembali untuk memakai Speaking AI." });

  try {
    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!userResponse.ok) return reply(res, 401, { error: "Sesi login berakhir. Masuk kembali, lalu coba lagi." });
    const user = await userResponse.json();
    if (!user || !user.id) return reply(res, 401, { error: "Sesi login tidak valid." });

    const now = Date.now(), windowMs = 60_000, maxPerWindow = 12;
    const recent = (limits.get(user.id) || []).filter(t => now - t < windowMs);
    if (recent.length >= maxPerWindow) return reply(res, 429, { error: "Batas sementara tercapai. Tunggu satu menit, lalu lanjutkan." });
    recent.push(now); limits.set(user.id, recent);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return reply(res, 503, { error: "Speaking AI belum diaktifkan. Admin perlu menambahkan kunci Gemini di Vercel." });
    const body = req.body || {};
    const level = ["A1", "A2", "B1", "B2", "C1"].includes(body.level) ? body.level : "A2";
    const topics = ["Everyday conversation", "At a café", "Meeting a new colleague", "In the classroom", "Talking about hobbies"];
    const scenario = topics.includes(body.scenario) ? body.scenario : topics[0];
    let messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
    if (messages[0]?.role === "model") messages = messages.slice(1);
    const contents = messages.map(m => ({
      role: m && m.role === "model" ? "model" : "user",
      parts: [{ text: String(m && m.text || "").trim().slice(0, 1000) }],
    })).filter(m => m.parts[0].text);
    if (!contents.length || contents[contents.length - 1].role !== "user") return reply(res, 400, { error: "Tulis pesan dulu sebelum mengirim." });
    if (contents.length > 1 && contents.slice(0, -1).some((m, i) => m.role === contents[i + 1].role)) {
      return reply(res, 400, { error: "Urutan percakapan tidak valid. Mulai percakapan baru." });
    }

    const model = /^[A-Za-z0-9._-]{1,80}$/.test(process.env.GEMINI_MODEL || "") ? process.env.GEMINI_MODEL : "gemini-2.5-flash";
    const prompt = `You are Michelle's kind, encouraging English conversation partner. Practice level: ${level}. Roleplay topic: ${scenario}. Speak primarily in natural English at the selected level. Keep each reply short (1–3 sentences), respond to what Michelle said, and end with one easy follow-up question so the conversation continues. If her English has a clear mistake, first respond naturally, then add one brief gentle correction using “A more natural way to say it: …”. Do not over-correct. For A1/A2, use simple common words. Never request real student names or private details; if provided, gently suggest using initials or fictional details.`;
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: prompt }] },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 260 },
      }),
      signal: AbortSignal.timeout(25_000),
    });
    if (!geminiResponse.ok) {
      if (geminiResponse.status === 429) return reply(res, 429, { error: "Kuota Gemini sedang penuh. Coba lagi nanti." });
      if (geminiResponse.status >= 500) return reply(res, 503, { error: "Layanan Gemini sedang sibuk. Coba lagi sebentar." });
      return reply(res, 502, { error: "Gemini belum bisa memproses pesan. Coba tulis dengan cara lain." });
    }
    const result = await geminiResponse.json();
    const text = (result.candidates?.[0]?.content?.parts || []).map(p => p.text || "").join("").trim().slice(0, 3000);
    if (!text) return reply(res, 502, { error: "AI belum mengirim balasan. Coba lagi." });
    return reply(res, 200, { text });
  } catch (error) {
    return reply(res, 503, { error: "Koneksi ke Speaking AI bermasalah. Periksa internet, lalu coba lagi." });
  }
};
