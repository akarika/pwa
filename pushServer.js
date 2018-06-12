const webPush = require('web-push');
const pushServerKey = require('./pushServerKeys.json');
const pushCientSubcription = require('./pushClientSubcription.json');

console.log('pushServerKey', pushServerKey);
console.log('pushCientSubcription', pushCientSubcription);

webPush.setVapidDetails('mailto:roux.remy.m@gmail.com', pushServerKey.publicKey, pushServerKey.privateKey)

const subscription = {
    endpoint: pushCientSubcription.endpoint,
    keys: {
        auth: pushCientSubcription.keys.auth,
        p256dh: pushCientSubcription.keys.p256dh
    }
};

webPush.sendNotification(subscription, 'Notification envoyé depuis serveur push')
    .then(res => {
        console.log('push notif bien pousssée', res);
    }).catch(err => console.error(err));