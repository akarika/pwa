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
```
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
  ```
  self.addEventListener('install', evt =>{
    console.log('install', evt);   
})
```
  #### Activation
  sw.js
  ```
self.addEventListener('activate', evt =>{
    console.log('activate', evt);   
})
```
Le SW peut mettre en cache les pages que vous visitez
L'interface CacheStorage de l'API ServiceWorker représente le stockage pour les objets Cache. Elle fournit un répertoire général de tous les caches auquel un ServiceWorker peut accéder, et maintient une correspondance entre les chaînes de noms et ces objets Cache.
https://developer.mozilla.org/fr/docs/Web/API/CacheStorage
```
if(window.caches){ // verifie que l API existe
    //ouvre un cache si lexiste , sinon le crée
    caches.open('veille-techno-1.0');
}
```