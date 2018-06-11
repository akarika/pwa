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
// if window.Notification and if window.Notification is not disabled
if(window.Notification && window.Notification !==  'undefined'){
    const options = {
        body:'Je suis le body de la notification',
        icon: 'images/icons/icon-72x72.png'
    }
    Notification.requestPermission(perm =>{
        if(perm === 'granted'){
           new Notification('Hello !!PwA', options)
        }else{
            console.log('non autorisé');
        }
    }).then(res=>console.log(res))//granted
}

/*  if(navigator.serviceWorker){
    navigator.serviceWorker.register('sw.js')
    .then(res => console.log('ServiceWorker registration successful with scope: ', res))
    .catch(err=> console.error(err))
}  */
/* if(window.caches){
    ouvre un cache si lexiste pas le cré
    caches.open('veille-techno-1.0');
    caches.open('other-caches');
    caches.keys()
    .then(console.log);
["veille-techno-1.0", "other-caches"]
} */

/* if(window.caches){
    caches.open('veille-techno-1.0')
    .then(cache => {
        cache.addAll([
            'index.html',
            'main.js',
            'vendors/bootstrap4.min.css'
        ])
    })
} */