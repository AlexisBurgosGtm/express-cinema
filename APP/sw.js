let GlobalSelectedForm = 'viewLogin';
let GlobalBool = 0;

var CACHE = 'onne-cinema';
const staticAssets = [
  './',
  './manifest.json',
  './favicon.png',
  './index.html',
  './sw.js'
];

self.addEventListener('install', function(evt) {
  //console.log('Service worker instalado');
  evt.waitUntil(caches.open(CACHE).then(function (cache) {
    cache.addAll(staticAssets);
  }));
});

self.addEventListener('fetch', function(evt) {
  
});

function fromCache(request) {
  return caches.open(CACHE).then(function (cache) {
    return cache.match(request);
  });
}

async function update(request) {
  return caches.open(CACHE).then(function (cache) {
    return fetch(request)
        .then(function (response) {
          return cache.put(request, response.clone())
                      .then(function () {
                        //console.log('Cache actualizado');
          return response;
      });
    });
  });
}
    

