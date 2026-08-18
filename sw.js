/* BankerSpeak Pro — service worker */
const V = 'bankerspeak-v3-1';
const ASSETS = ['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  './icon-maskable-512.png','./apple-touch-icon.png','./favicon.png'];
self.addEventListener('install', e => { self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => c.addAll(ASSETS).catch(() => {}))); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks =>
  Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || !r.url.startsWith(self.location.origin)) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const cp = res.clone();
      caches.open(V).then(c => c.put(r, cp)); return res;
    }).catch(() => caches.match(r).then(m => m || caches.match('./index.html')))); return; }
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(res => { const cp = res.clone();
    caches.open(V).then(c => c.put(r, cp)); return res; }).catch(() => m)));
});
