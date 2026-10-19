const usage = globalThis.__pronunciationUsage || (globalThis.__pronunciationUsage = new Map());

function reply(res, status, body, cache = "no-store") {
  res.status(status);
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", cache);
  res.end(JSON.stringify(body));
}

async function lookup(word) {
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + encodeURIComponent(word);
  const response = await fetch(url, { signal: AbortSignal.timeout(7000) });
  if (!response.ok) return null;
  const entries = await response.json();
  if (!Array.isArray(entries)) return null;
  for (const entry of entries) {
    const phonetics = Array.isArray(entry.phonetics) ? entry.phonetics : [];
    const ipa = entry.phonetic || (phonetics.find(item => item.text)?.text);
    if (ipa) {
      return {
        ipa: String(ipa).replace(/^\/+|\/+$/g, ""),
        source: (entry.sourceUrls || []).find(url => /^https:\/\/en\.wiktionary\.org\//i.test(url)) || "",
      };
    }
  }
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return reply(res, 405, { error: "Metode ini tidak didukung." });

  const ip = String(req.headers["x-forwarded-for"] || "unknown").split(",")[0].trim();
  const now = Date.now();
  const recent = (usage.get(ip) || []).filter(time => now - time < 60_000);
  if (recent.length >= 90) return reply(res, 429, { error: "Terlalu banyak permintaan. Coba lagi sebentar." });
  recent.push(now);
  usage.set(ip, recent);

  const query = String((req.query && req.query.word) || "").trim().toLowerCase();
  const normalized = query.replace(/^[^a-z]+|[^a-z]+$/g, "").replace(/[.,!?;:()[\]"]/g, " ").replace(/\s+/g, " ").trim();
  const words = normalized.split(" ");
  if (!normalized || normalized.length > 70 || words.length > 5 ||
      !words.every(word => /^[a-z]+(?:(?:['’]|-)[a-z]+)*$/.test(word))) {
    return reply(res, 400, { error: "Kata atau frasa tidak valid." });
  }

  try {
    const unique = [...new Set(words)];
    const found = await Promise.all(unique.map(lookup));
    if (found.some(item => !item)) {
      return reply(res, 404, { error: "Cara baca belum tersedia." }, "public, s-maxage=3600, stale-while-revalidate=86400");
    }
    const byWord = new Map(unique.map((word, index) => [word, found[index]]));
    const ipa = words.map(word => byWord.get(word).ipa).join(" ");
    const sources = [...new Set(found.map(item => item.source).filter(Boolean))];
    return reply(res, 200, { ipa: "/" + ipa + "/", sources }, "public, s-maxage=86400, stale-while-revalidate=604800");
  } catch (error) {
    return reply(res, 502, { error: "Kamus pelafalan sedang tidak tersedia." }, "public, s-maxage=60, stale-while-revalidate=300");
  }
};