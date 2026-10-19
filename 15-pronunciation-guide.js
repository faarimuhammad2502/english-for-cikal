(() => {
  const STORE = "english-guru-cikal-pronunciation-v1";
  const view = document.getElementById("view");
  if (!view || !("IntersectionObserver" in window)) return;

  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch (e) {}
  const pattern = /^[a-z]+(?:(?:['’]|-)[a-z]+)*(?:\s+[a-z]+(?:(?:['’]|-)[a-z]+)*){0,4}$/i;

  function normalize(text) {
    return String(text || "").trim().replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "")
      .replace(/[.,!?;:()[\]"]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  }

  function cacheSave() {
    try { localStorage.setItem(STORE, JSON.stringify(cache)); } catch (e) {}
  }

  function fallback(row) {
    row.textContent = "Cara baca belum tersedia · tekan 🔊 Dengarkan";
    row.classList.add("missing");
  }

  function show(row, result) {
    row.classList.remove("missing");
    row.textContent = "Cara baca (IPA): " + result.ipa;
    const sources = Array.isArray(result.sources) ? result.sources : [];
    const valid = sources.filter(url => /^https:\/\/en\.wiktionary\.org\/wiki\//i.test(url));
    if (valid.length) {
      row.append(document.createTextNode(" · "));
      const a = document.createElement("a");
      a.href = valid[0];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = "sumber Wiktionary";
      row.append(a);
    }
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      const row = entry.target.nextElementSibling;
      if (!row || !row.classList.contains("pron-guide")) return;
      const word = entry.target.dataset.pronWord;
      const saved = cache[word];
      if (saved && saved.until > Date.now()) {
        saved.result ? show(row, saved.result) : fallback(row);
        return;
      }
      row.textContent = "Cara baca: memuat…";
      fetch("/api/pronunciation?word=" + encodeURIComponent(word), {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(10000),
      }).then(async response => {
        if (!response.ok) throw new Error("Pronunciation unavailable");
        return response.json();
      }).then(result => {
        if (!result || !result.ipa) throw new Error("Pronunciation unavailable");
        cache[word] = { result, until: Date.now() + 30 * 24 * 60 * 60 * 1000 };
        cacheSave();
        show(row, result);
      }).catch(() => {
        cache[word] = { result: null, until: Date.now() + 60 * 60 * 1000 };
        cacheSave();
        fallback(row);
      });
    });
  }, { rootMargin: "100px 0px", threshold: 0.01 });

  function scan() {
    view.querySelectorAll(".en, .wb > b, .w > b").forEach(target => {
      if (target.dataset.pronReady) return;
      const word = normalize(target.textContent);
      if (!pattern.test(word)) return;
      target.dataset.pronReady = "1";
      target.dataset.pronWord = word;
      const row = document.createElement("small");
      row.className = "pron-guide";
      row.setAttribute("aria-live", "polite");
      target.after(row);
      io.observe(target);
    });
  }

  new MutationObserver(scan).observe(view, { childList: true, subtree: true, characterData: true });
  scan();
})();