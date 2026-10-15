/* Service worker: mode offline. Naikkan VERSION setiap kali file web diperbarui. */
const VERSION = "v10-2026-10";
const CORE = ["./", "index.html", "style.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "config.js", "supabase.js", "01-data.js", "02-core.js", "03-templates.js", "04-review-practice.js", "05-events.js", "06-tests.js", "07-backup-mywords.js", "08-audio-spelling.js", "09-notes-board.js", "10-pronunciation.js", "11-navigation-progress.js", "12-cloud.js", "13-app.js"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// File web: ambil dari internet dulu supaya versi terbaru langsung tampil, cache hanya sebagai cadangan offline.
// Font Google: cache dulu (jarang berubah).
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
  } else if (/(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(
      caches.match(req).then((hit) =>
        hit || fetch(req).then((res) => {
          if (res && (res.ok || res.type === "opaque")) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
      )
    );
  }
});
