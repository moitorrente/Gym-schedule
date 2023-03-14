const GHPATH = '/Gym-schedule';
const APP_PREFIX = 'Gym_schedule_';
const VERSION = 'version_0016d';
const RUNTIME = 'runtime';

const URLS = [
  `${GHPATH}/`,
  `${GHPATH}/icon.png`,
  `${GHPATH}/index.html`,
  `${GHPATH}/html/add-exercise.html`,
  `${GHPATH}/html/calendar.html`,
  `${GHPATH}/html/exercises.html`,
  `${GHPATH}/html/historic.html`,
  `${GHPATH}/html/insights.html`,
  `${GHPATH}/html/log-exercise.html`,
  `${GHPATH}/html/memory-usage.html`,
  `${GHPATH}/html/settings.html`,
  `${GHPATH}/html/user.html`,
  `${GHPATH}/html/view-data.html`,
  `${GHPATH}/html/workout-details.html`,
  `${GHPATH}/html/workout-historic.html`,
  `${GHPATH}/html/workouts.html`,
  `${GHPATH}/html/year-view.html`,
 
  `${GHPATH}/js/script.js`,
  `${GHPATH}/js/add.js`,
  `${GHPATH}/js/bootstrap.bundle.min.js`,
  `${GHPATH}/js/calendar.js`,
  `${GHPATH}/js/data.js`,
  `${GHPATH}/js/exercises.js`,
  `${GHPATH}/js/historic.js`,
  `${GHPATH}/js/insights.js`,
  `${GHPATH}/js/log.js`,
  `${GHPATH}/js/memory-usage.js`,
  `${GHPATH}/js/settings.js`,
  `${GHPATH}/js/user.js`,
  `${GHPATH}/js/view-data.js`,
  `${GHPATH}/js/workout-details.js`,
  `${GHPATH}/js/workout-historic.js`,
  `${GHPATH}/js/workouts.js`,
  `${GHPATH}/js/year-view.js`,
 
  `${GHPATH}/css/style.css`,
  `${GHPATH}/css/calendar.css`,
  `${GHPATH}/css/dark.css`,
  `${GHPATH}/css/light.css`,
  `${GHPATH}/css/bootstrap.min.css`,
  
  `${GHPATH}/data/exercises.json`,
  `${GHPATH}/data/version.json`,
  `${GHPATH}/data/workouts.json`
]

const CACHE_NAME = APP_PREFIX + VERSION;
// self.addEventListener('fetch', function (e) {
//   console.log('Fetch request : ' + e.request.url);
//   e.respondWith(
//     caches.match(e.requests).then(function (request) {
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

self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return caches.open(RUNTIME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});

// self.addEventListener('install', function (e) {
//   e.waitUntil(
//     caches.open(CACHE_NAME).then(function (cache) {
//       console.log('Installing cache : ' + CACHE_NAME);
//       return cache.addAll(URLS)
//     })
//   )
// })

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(URLS))
      .then(self.skipWaiting())
  );
});

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
