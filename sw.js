// Network-first for the game page: with internet you get the latest version,
// without internet the saved copy opens. Progress and photo live in localStorage and are not touched.
const CACHE="pereliv-v2";
const FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin!==location.origin)return; // fonts etc. go straight to the network
  e.respondWith(
    fetch(req,{cache:"no-store"}).then(r=>{
      if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}
      return r;
    }).catch(()=>caches.match(req,{ignoreSearch:true}).then(hit=>hit||caches.match("index.html")))
  );
});
