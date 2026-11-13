/* BankerSpeak Pro service worker — v2.0.0
   Pages: network-first (new versions arrive as soon as you're online; cached copy when offline).
   Icons/manifest: cache-first. Old caches are deleted on activation. */
const VERSION = 'bsp-v2.0.0';
const CORE = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-192.png', './icons/maskable-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const url = new URL(r.url);
  if (url.origin !== self.location.origin) return;
  if (r.mode === 'navigate') {
    e.respondWith(
      fetch(r).then(res => {
        if (res.ok) { const cp = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', cp)); }
        return res;
      }).catch(() => caches.match('./index.html').then(m => m || caches.match('./')))
    );
    return;
  }
  e.respondWith(
    caches.match(r).then(m => m || fetch(r).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(VERSION).then(c => c.put(r, cp)); }
      return res;
    }))
  );
});
