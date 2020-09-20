importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v4';
const INMUTABLE_CACHE = 'inmutable-v1';
const DYNAMIC_CACHE = 'dynamic-v2';


// LO DE UNO
const APP_SHELL_STATIC = [
    /* '/', */
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

// LIBRERIAS EXTERNAS
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

self.addEventListener('install', event => {
    const static_cache = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL_STATIC));
    const inmutable_cache = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));
    const promesasCache = Promise.all([static_cache, inmutable_cache]);
    event.waitUntil(promesasCache);
});

self.addEventListener('activate', event => {
    const respuesta = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) {
                return caches.delete(key)
            }
            if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key)
            }
        })
    })
    event.waitUntil(respuesta);
})

self.addEventListener('fetch', event => {
    const respuesta = caches.match(event.request).then(resp => {
        if (resp) { return resp }
        else {
            return fetch(event.request).then(newResp => actualizarCacheDinamico(DYNAMIC_CACHE, event.request, newResp))
        }
    })
    event.respondWith( respuesta );
})

