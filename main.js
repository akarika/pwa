console.log('hello depuis main');
const technosDiv = document.querySelector('#technos');

function loadTechnologies() {
    fetch('http://localhost:3001/technos')
        .then(response => {
            response.json()
                .then(technos => {
                    const allTechnos = technos.map(t => `<div><b>${t.name}</b> ${t.description}  <a href="${t.url}">site de ${t.name}</a> </div>`)
                        .join('');

                    technosDiv.innerHTML = allTechnos;
                });
        })
        .catch(console.error);
}

loadTechnologies();


if ('serviceWorker' in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
        console.log('Service worker registration succeeded:', registration);
    }).catch(function (error) {
        console.log('Service worker registration failed:', error);
    });
} else {
    console.log('Service workers are not supported.');
}
/*  if(navigator.serviceWorker){
    navigator.serviceWorker.register('sw.js')
    .then(res => console.log('ServiceWorker registration successful with scope: ', res))
    .catch(err=> console.error(err))
}  */

if(window.caches){
    //ouvre un cache si lexiste pas le cré
    caches.open('veille-techno-1.0');
    caches.open('other-caches');
    caches.keys()
    .then(console.log);
//["veille-techno-1.0", "other-caches"]
}