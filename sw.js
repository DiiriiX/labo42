const CACHE = "labo42-v4";
const SHELL = ["./", "./index.html", "./terminal.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png", "./actus.json", "./resume.json", "./lessons/terminal.json", "./lessons/c.json", "./lessons/reseau.json", "./lessons/cyber.json"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const fresh = (req, key) => fetch(req).then(r => {
  if (r.ok) { const copy = r.clone(); caches.open(CACHE).then(c => c.put(key, copy)); }
  return r;
}).catch(() => caches.match(key));
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  if (url.pathname.endsWith("actus.json")) { e.respondWith(fresh(e.request, "./actus.json")); return; }
  if (url.pathname.endsWith("resume.json")) { e.respondWith(fresh(e.request, "./resume.json")); return; }
  if (e.request.mode === "navigate") { e.respondWith(fresh(e.request, "./index.html")); return; }
  if (url.pathname.endsWith(".js") || url.pathname.includes("/lessons/")) { e.respondWith(fresh(e.request, e.request)); return; }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {body: e.data ? e.data.text() : ""}; }
  e.waitUntil(self.registration.showNotification(d.title || "Labo 42", {
    body: d.body || "", icon: "icon-192.png", badge: "icon-192.png", tag: d.id || undefined,
    data: {url: d.url || "./#veille"}
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil(clients.matchAll({type: "window", includeUncontrolled: true}).then(list => {
    for (const c of list) if ("focus" in c) { if ("navigate" in c) c.navigate(url); return c.focus(); }
    return clients.openWindow(url);
  }));
});
