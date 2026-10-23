// Kame の Service Worker
// 方針: ページ・CSS・JS は「ネット優先」(管理ページで直した内容がすぐ出る)。
//       つながらないときだけ、前に見たものを出す。画像は保存済みを先に出す。
// 大きく作り変えたときは、下の VERSION を上げると古い保存が消えます。
const VERSION = "kame-v1";
const CORE = ["./", "index.html", "style.css", "menu.js", "icon.jpg", "favicon.png", "manifest.webmanifest", "offline.html"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.all(CORE.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(req) {
  const cache = await caches.open(VERSION);
  try {
    const res = await fetch(req, { cache: "no-cache" });
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await cache.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === "navigate") return cache.match("offline.html");
    return Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req);
  const net = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => hit);
  return hit || net;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;                    // 他サイト(カウンターなど)はそのまま
  if (/\/Apps\//.test(url.pathname) || /\.apk$/i.test(url.pathname)) return;   // APK は保存しない
  if (/\/admin\.html$/.test(url.pathname)) return;               // 管理ページは常に最新を見る
  const isCode = req.mode === "navigate" || /\.(html|css|js|webmanifest)$/.test(url.pathname) || url.pathname.endsWith("/");
  e.respondWith(isCode ? networkFirst(req) : staleWhileRevalidate(req));
});
