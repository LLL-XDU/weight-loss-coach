const CACHE = "wl-coach-v1";
const SHELL = ["./", "index.html", "css/style.css", "manifest.json",
  "js/app.js", "js/plan.js", "js/food.js", "js/coach.js", "js/db.js", "js/store.js",
  "js/notify.js", "js/ui/today.js", "js/ui/meals.js", "js/ui/runs.js",
  "js/ui/weight.js", "js/ui/timetable.js", "js/ui/settings.js",
  "icons/icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request)));
});
