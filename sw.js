console.log('hey');
self.addEventListener('install', evt => {
    console.log('install', evt);
});
self.addEventListener('activate', evt => {
    console.log('activate', evt);
});
self.addEventListener('fetch', evt => {
    if (!navigator.onLine) {
        const headers = { headers: { 'Content-Type': 'text/html;charset=utf-8' } };
        evt.respondWith( async function(){
                const response = await new Response('<h1>Pas de connexion internet</h1><div>Application en mode dégradé. Veuillez vous connecter</div>', headers);
                return response;
        }());
    }
    console.log('fetch', evt.request.url);
})

