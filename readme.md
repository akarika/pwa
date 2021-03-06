## Service Worker

D’un point de vue technique, un service worker est un **script** exécuté en **arrière-plan** par un navigateur. Il est capable d’**exécuter des actions en réponse à des évènements** comme des requêtes réseau, ou des infos transmises par le système d’exploitation (modifications de connectivité par exemple). Il permet aux développeurs de **construire des fonctionnalités avancées** comme la gestion de notifications push et la gestion du cache. Une fois le service worker installé dans le navigateur, il effectue les tâches qui lui sont assignées de manière indépendante, et ce même si l'utilisateur ne navigue pas sur le site. Le fonctionnement d’un service worker s’approche de celui d’un **serveur proxy**, il va servir d’**intermédiaire entre le navigateur et Internet** afin d’améliorer l’expérience utilisateur, notamment en stockant les données d’une page web en cache.

![alt text](https://cmsphoto.ww-cdn.com/superstatic/40142/art/grande/18510515-22641604.jpg?v=1511868551 "LService Worker")

En synthèse, un service worker est finalement un simple fichier JavaScript qui s'exécute en arrière plan et qui se déclenche à l’appel de certains évènements.  Il va intercepter les requêtes faites au serveur et sera de  capable de **renvoyer une réponse** soit en transmettant la **ressource reçue** par le  serveur, soit en fournissant une **version locale** de la ressource si elle a déjà été demandée. Dans le cas des Progressive Web Apps GoodBarber par exemple, il va permettre d'optimiser la manière dont le navigateur va afficher les polices de caractères en les téléchargeant lors de la première visite de l'utilisateur et en les stockant en cache. Lors des visites ultérieures, la police sera servie localement, ce qui rendra l'affichage de la police instantanée, garantissant un affichage de l'application plus rapide.

* Possibilité de mettre en cache une page
* Ecoute des push request (Push serveur)
* Mode offline

### Cyle de vie service Worker
![alt text](https://developers.google.com/web/fundamentals/primers/service-workers/images/sw-lifecycle.png "LService Worker")

#### Installation 
dans app.js
```javascript
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
  ```
  dans sw.js
  ```javascript
  self.addEventListener('install', evt =>{
    console.log('install', evt);   
})
```
  #### Activation
  sw.js
  ```javascript
self.addEventListener('activate', evt =>{
    console.log('activate', evt);   
})
```
Le SW peut mettre en cache les pages que vous visitez
L'interface CacheStorage de l'API ServiceWorker représente le stockage pour les objets Cache. Elle fournit un répertoire général de tous les caches auquel un ServiceWorker peut accéder, et maintient une correspondance entre les chaînes de noms et ces objets Cache.
https://developer.mozilla.org/fr/docs/Web/API/CacheStorage
```javascript
if(window.caches){ // verifie que l API existe
    //ouvre un cache si lexiste , sinon le crée
    caches.open('veille-techno-1.0');
}
```
https://www.julienpradet.fr/fiches-techniques/pwa-intercepter-les-requetes-http-et-les-mettre-en-cache/
#### Il existe différente stratégie de mise en caches 

**Network Only** : on ne veut pas de cache car l'opération est critique/ne peut pas fonctionner hors ligne. Si ce n'est qu'une partie de l'application, il est important d'expliquer clairement au niveau de l'interface pourquoi la fonctionnalité n'est pas disponible.

**Cache First** : on récupère en priorité depuis le cache. S'il n'y a pas encore de cache, on va chercher sur le réseau et on stocke la réponse dans le cache. L'intérêt est qu'une fois qu'on a mis quelque chose en cache, on est capable de le servir très rapidement à l'utilisateur. La performance ressentie s'en retrouve grandement améliorée.

**Network First** : on récupère en priorité depuis le réseau. Si le réseau ne répond pas, on sert le cache afin d'afficher du contenu. Cela permet d'afficher du contenu qui n'est peut-être plus à jour, mais qui a le mérite d'être là.

**Stale While Revalidate** : on récupère le cache et on l'envoie. Le contenu est ainsi directement disponible. Ensuite, on va chercher la requête sur le réseau pour que ce soit à jour la prochaine fois qu'on fait la requête.

* Network Only
```javascript
// Network Only
self.addEventListener('fetch', evt => {
    evt.respondWith(
        fetch(evt.request).then( res => {
            // we add the latest version into the cache
            caches.open(cacheName).then(cache => cache.put(evt.request, res));
            // we clone it as a response can be read only once (it's like a one time read stream)
            return res.clone();
        })
        .catch(err => caches.match(evt.request))
    );

    //ES7 version
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

```
* Cache First
```javascript
// caches stategy with network fallback
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
```

### Manifeste 

Le manifeste d'une application web fournit des informations concernant celle-ci (comme son nom, son auteur, une icône et une description) dans un document texte JSON. Le but du manifeste est d'installer des applications sur l'écran d'accueil d'un appareil, offrant aux utilisateurs un accès plus rapide et une expérience plus riche.

https://developer.mozilla.org/fr/docs/Web/Manifest



## Notification push persistante

```javascript
window.Notification // vérifie si le navigateur L'api
window.Notification !==  'undefined' // vérifie que le notifications ne sont désactivé
if(window.Notification && window.Notification !==  'undefined'){
    Notification.requestPermission(perm =>{
        if(perm === 'granted'){
            const notif = new Notification('Hello notification')
        }else{
            console.log('non autorisé');
        }
    }).then(res=>console.log(res))//granted
}
```

Le constructeur Notification() posséde aussi la possibilité de mettre des options
https://developer.mozilla.org/en-US/docs/Web/API/notification/Notification

```javascript
   const options = {
        body:'Je suis le body de la notification',
        icon: 'images/icons/icon-72x72.png'
    }
```

* le SW peut écouter alors que l 'app est fermé 
* écouter un serveur de push notification
* envoyer une notifiaction alors qu el app est fermé
```javascript
self.registration.showNotification('Notif depuis le sw', {
    body: "body !!! sw"
});
// réagit a la fermeture de la notification
self.addEventListener('notificationclose', evt => {
    console.log('notification fermé', evt);
});
```

Etape 0

génération d un couple clé publique /clé privée
clé publique du brow²er a firebase pur une demande de souscription pôur générer une vapid key
récupération d une fonction capable de convertir une string (qui est en base64) en array buffer(Uint8Array)

Etape1 

client (chrome) joint une clé publique pour effectuer une demande de souscription
auprés de ------------> Firebase cloud messaging
        <----------- FCM envoie une souscription

Etape 2 

configurer un push server Node afin qu'il puisse envoyer une push notification à un utilisateur possédanbt une soucirption crée durant la étape 1