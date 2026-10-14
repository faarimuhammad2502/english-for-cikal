/* Service worker: mode offline. Naikkan VERSION setiap kali file web diperbarui. */
const VERSION = "v2-2026-10";
const CORE = ["./", "index.html", "style.css", "manifest.webmanifest", "icon-192.png", "icon-512.png", "01-data.js", "02-core.js", "03-templates.js", "04-review-practice.js", "05-events.js", "06-tests.js", "07-backup-mywords.js", "08-audio-spelling.js", "09-notes-board.js", "10-pronunciation.js", "11-navigation-progress.js", "12-app.js"];

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

// Tampilkan dari cache dulu (cepat dan bisa offline), lalu perbarui cache di belakang layar.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const ok = url.origin === location.origin || /(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!ok) return;
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      const net = fetch(req)
        .then((res) => {
          if (res && (res.ok || res.type === "opaque")) {
            const copy = res.clone();
            caches.open(VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || net;
    })
  );
});
