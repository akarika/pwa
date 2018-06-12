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
/*------------------------------------------------------*/
loadTechnologies();
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

/* const vapidPublicKey = '<Your Public Key from generateVAPIDKeys()>';
const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
}); */
/*---------------------------------------------------------- */

if ('serviceWorker' in navigator) {
    // Register a service worker hosted at the root of the
    // site using the default scope.
    navigator.serviceWorker.register('/sw.js').then(function (registration) {
        console.log('Service worker registration succeeded:', registration);
        // public vapid key générated with web-push

        const publicKey = "BNNHRLxzTUBNptec51TuM_r5oo-HCpTCZ5h7LUllXjjyF-ke1oqowJc76J5JuK-3vBmIoTTK1en1W4ekwx-Gh4M";
        registration.pushManager.getSubscription().then(subscription => {
            if (subscription) {
                console.log('subsciption', subscription);
                extractKeyxFromArrayBuffer(subscription);
                return subscription;
            } else {
                //ou subscription est nul car on a jamais fait de demande
                // ask for a subcription
                const convertedKey = urlBase64ToUint8Array(publicKey);
                return registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: convertedKey
                })
                    .then(newSubcription => {
                        extractKeyxFromArrayBuffer(subscription);
                        console.log('newsubcription', newSubcription);
                        return subscription;
                    });
            }
        });
    }).catch(function (error) {
        console.log('Service worker registration failed:', error);
    });
} else {
    console.log('Service workers are not supported.');
}
//persistant notification 
// if window.Notification and if window.Notification is not disabled
if (window.Notification && window.Notification !== 'undefined') {
    const options = {
        body: 'Je suis le body de la notification',
        icon: 'images/icons/icon-72x72.png'
    }
    Notification.requestPermission(perm => {
        if (perm === 'granted') {
            //  new Notification('Hello !!PwA', options)
        } else {
            console.log('non autorisé');
        }
    }).then(res => console.log(res))//granted
}
function extractKeyxFromArrayBuffer(subscription) {
    // no more keys proprety directly visible on the subscription objet. So you have to use getKey()
    const keyArrayBuffer = subscription.getKey('p256dh');
    const authArrayBuffer = subscription.getKey('auth');
    const p256dh = btoa(String.fromCharCode.apply(null, new Uint8Array(keyArrayBuffer)));
    const auth = btoa(String.fromCharCode.apply(null, new Uint8Array(authArrayBuffer)));
    console.log('p256dh key', keyArrayBuffer, p256dh);
    console.log('auth key', authArrayBuffer, auth);
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

