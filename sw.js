console.log('hey SW');
const cacheName = 'veille-techno-1.0';
self.addEventListener('install', evt => {
    console.log('install', evt);
    //self.skipWaiting();
    const cachePromise = caches.open(cacheName)
        .then(cache => {
            cache.addAll([
                'index.html',
                'main.js',
                'style.css',
                'vendors/bootstrap4.min.css',
                'add_techno.html',
                'add_techno.js',
                'contact.html',
                'contact.js'
            ]).then(console.log('cache initialisé'))
                .catch(console.err);;
        });
    evt.waitUntil(cachePromise);
});
self.addEventListener('activate', evt => {
    console.log('activate', evt);
});
self.addEventListener('fetch', evt => {
    console.log('evt', evt);
    //if offline
    if (!navigator.onLine) {
        const headers = { headers: { 'Content-Type': 'text/html;charset=utf-8' } };
        evt.respondWith(async function () {
            const response = await new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connecter</div>', headers);
            return response;
        }());
    }
// network first strategy
/* self.addEventListener('fetch', evt => {
    evt.respondWith(
        fetch(evt.request).then( res => {
            // we add the latest version into the cache
            caches.open(cacheName).then(cache => cache.put(evt.request, res));
            // we clone it as a response can be read only once (it's like a one time read stream)
            return res.clone();
        })
        .catch(err => caches.match(evt.request))
    );
} */
// caches stategy
     console.log(`fetch sur url ${evt.request.url}`);
         evt.respondWith(
             // if evt.request is in caches 
            caches.match(evt.request)
            .then(res => {
                console.log('res', res);
                if(res){
                  return res;  
                } 
                // if evt.request is not in caches , put in caches
                return fetch(evt.request)
                .then(newResponse =>{
                    caches.open(cacheName)
                    .then(cache => cache.put(evt.request,newResponse));
                    return newResponse.clone();
                })
            })  
        );
})


