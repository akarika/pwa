console.log('hey SW');
const cacheName = 'veille-techno-1.3';
self.addEventListener('install', evt => {
    console.log('install', evt);
    //self.skipWaiting();
    const files = ['index.html',
        'main.js',
        'style.css',
        'vendors/bootstrap4.min.css',
        'add_techno.html',
        'add_techno.js',
        'contact.html',
        'contact.js'
    ];

    const startSw = async () => {
        try {
            const cachePromise = await caches.open(cacheName);
            await cachePromise.addAll(files)
            console.log('cache initialisé');
        } catch (error) {
            console.error(error)
        }
    };
    startSw();
    //permet de dire au navigateur qu il y aun travial en cours , et qu il ne doit pas quitter tant que le SW n'a pas finit son travail 
    evt.waitUntil(startSw);
});
self.addEventListener('activate', evt => {
    console.log('activate', evt);
    //anonymous asyn function , promise all for each key in caches.key
    evt.waitUntil(async function () {
        await caches.keys().then(keys => {
            return Promise.all([keys.forEach(key => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            })]);
        })
    }());
});
self.addEventListener('fetch', evt => {
    console.log('evt', evt);
    //if offline
    /*     if (!navigator.onLine) {
            const headers = { headers: { 'Content-Type': 'text/html;charset=utf-8' } };
            evt.respondWith(async function () {
                const response = await new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connecter</div>', headers);
                return response;
            }());
        } */

    // caches stategy
    /*         evt.respondWith(
                // if evt.request is in caches 
                caches.match(evt.request)
                    .then(res => {
                        if (res) {
                            console.log(`url fetch depuis le cache ${evt.request.url}`, res);
                            return res;
                        }
                        // if evt.request is not in caches , put in caches
                        return fetch(evt.request)
                            .then(newResponse => {
                                console.log(`url récupéré puis mis en cache ${evt.request.url} `, newResponse);
                                caches.open(cacheName)
                                    .then(cache => cache.put(evt.request, newResponse));
                                return newResponse.clone();
                            })
                    })
            ); */
    // strategy network first with fallback   ES6
    /*         evt.respondWith(
                fetch(evt.request).then( res => { 
                           console.log('hello');
                    // we add the latest version into the cache
                    caches.open(cacheName).then(cache => cache.put(evt.request, res));
                    // we clone it as a response can be read only once (it's like a one time read stream)
                    return res.clone();
                })
                .catch(err => caches.match(evt.request))
            ); */

    // strategy network first with fallback        ES7
    evt.respondWith(async function () {
        console.log('ici');
        try {
            const response = await (fetch(evt.request));
            const clone = response.clone();
            const oCaches = await (caches.open(cacheName));
            const putCaches = await (oCaches.put(evt.resquest, response));
            console.log(`depuis le réseaux ${evt.request.url}`);
            return clone;
        } catch (e) {
            console.error('error strategy network first with fallback', e)
            console.log(`depuis le cache ${evt.request.url}`);
            return caches.match(evt.request);
        }
    }());

});
// le SW peut écouter alors que l 'app est fermé 
// écouter un serveur de push notification
//envoyer une notifiaction alors qu el app est fermé
self.registration.showNotification('Notif depuis le sw', {
    body: "body !!! sw"
});
self.addEventListener('notificationclose', evt => {
    console.log('notification fermé', evt);
});
