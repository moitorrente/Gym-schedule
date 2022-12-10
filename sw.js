const GHPATH = '/Gym-schedule';
const APP_PREFIX = 'Gym_schedule_';
const VERSION = 'version_0013g';

const URLS = [
  `${GHPATH}/`,
  `${GHPATH}/icon.png`,
  `${GHPATH}/index.html`,
  `${GHPATH}/html/add-exercise.html`,
  `${GHPATH}/html/log-exercise.html`,
  `${GHPATH}/html/view-data.html`,
  `${GHPATH}/html/workouts.html`,
  `${GHPATH}/html/settings.html`,
  `${GHPATH}/html/memory-usage.html`,
  `${GHPATH}/js/script.js`,
  `${GHPATH}/js/log.js`,
  `${GHPATH}/js/add.js`,
  `${GHPATH}/css/style.css`,
  `${GHPATH}/css/calendar.css`,
  `${GHPATH}/css/bootstrap.min.css`,
  `${GHPATH}/html/historic.html`,
  `${GHPATH}/js/historic.js`,
  `${GHPATH}/js/workouts.js`,
  `${GHPATH}/js/calendar.js`,
  `${GHPATH}/js/settings.js`,
  `${GHPATH}/js/view-data.js`,
  `${GHPATH}/js/chart.js`,
  `${GHPATH}/js/data.js`,
  `${GHPATH}/js/memory-usage.js`,
  `${GHPATH}/js/bootstrap.bundle.min.js`,
  `${GHPATH}/data/exercises.json`,
  `${GHPATH}/data/version.json`,
  `${GHPATH}/data/workouts.json`
]

var CACHE_NAME = APP_PREFIX + VERSION;
//Cache first
// self.addEventListener('fetch', function (e) {
//   console.log('Fetch request : ' + e.request.url);
//   e.respondWith(
//     caches.match(e.request).then(function (request) {
//       if (request) {
//         console.log('Responding with cache : ' + e.request.url);
//         return request
//       } else {
//         console.log('File is not cached, fetching : ' + e.request.url);
//         return fetch(e.request)
//       }
//     })
//   )
// })

// fetch the resource from the network
const fromNetwork = (request, timeout) =>
  new Promise((fulfill, reject) => {
    const timeoutId = setTimeout(reject, timeout);
    fetch(request).then(response => {
      clearTimeout(timeoutId);
      fulfill(response);
      update(request);
    }, reject);
  });

// fetch the resource from the browser cache
const fromCache = request =>
  caches
    .open(CACHE_NAME)
    .then(cache =>
      cache
        .match(request)
        .then(matching => matching || cache.match('/offline/'))
    );

// cache the current page to make it available for offline
const update = request =>
  caches
    .open(CACHE_NAME)
    .then(cache =>
      fetch(request).then(response => cache.put(request, response))
    );

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
self.addEventListener('fetch', evt => {
  evt.respondWith(
    fromNetwork(evt.request, 1000).catch(() => fromCache(evt.request))
  );
  evt.waitUntil(update(evt.request));
});


self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      var cacheWhitelist = keyList.filter(function (key) {
        return key.indexOf(APP_PREFIX)
      })
      cacheWhitelist.push(CACHE_NAME);
      return Promise.all(keyList.map(function (key, i) {
        if (cacheWhitelist.indexOf(key) === -1) {
          console.log('Deleting cache : ' + keyList[i]);
          return caches.delete(keyList[i])
        }
      }))
    })
  )
})