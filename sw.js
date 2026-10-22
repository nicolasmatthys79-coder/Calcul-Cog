const CACHE='aerobalance-offline-v2.131';
const APP=new URL('index.html',self.registration.scope).href;
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const response=await fetch(APP,{cache:'reload'});if(!response.ok)throw new Error('Application unavailable');
 const cache=await caches.open(CACHE);await cache.put(APP,response);await cache.addAll(['ac-blue-apple-v2-19.png','ac-blue-192-v2-19.png','ac-blue-512-v2-19.png','manifest.webmanifest?v=2.20'].map(path=>new URL(path,self.registration.scope).href));await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('aerobalance-offline-')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 if(event.request.mode!=='navigate'){const url=new URL(event.request.url);if(['ac-blue-apple-v2-19.png','ac-blue-192-v2-19.png','ac-blue-512-v2-19.png','manifest.webmanifest?v=2.20'].some(name=>url.href===new URL(name,self.registration.scope).href))event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(event.request)||fetch(event.request);})());return;}
 const url=new URL(event.request.url);if(url.origin!==self.location.origin||!url.href.startsWith(self.registration.scope))return;
 if(url.pathname!==new URL(APP).pathname&&url.pathname!==new URL(self.registration.scope).pathname)return;
 event.respondWith((async()=>{
 const cache=await caches.open(CACHE),controller=new AbortController(),timer=setTimeout(()=>controller.abort(),3000);
 try{const response=await fetch(event.request,{signal:controller.signal});if(!response.ok)throw new Error('Server unavailable');await cache.put(APP,response.clone());return response;}
 catch{const saved=await cache.match(APP);return saved||Response.error();}
 finally{clearTimeout(timer);}
 })());
});
