const GHPATH = '/Gym-schedule';
const APP_PREFIX = 'Gym_schedule_';
const VERSION = 'version_0013';

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
  `${GHPATH}/js/view-data.js`,
  `${GHPATH}/js/chart.js`,
  `${GHPATH}/js/data.js`,
  `${GHPATH}/js/memory-usage.js`,
  `${GHPATH}/js/bootstrap.bundle.min.js`,
  `${GHPATH}/data/exercises.json`,
  `${GHPATH}/data/version.json`,
  `${GHPATH}/data/workouts.json`
]

var CACHE_NAME = APP_PREFIX + VERSION
self.addEventListener('fetch', function (e) {
  console.log('Fetch request : ' + e.request.url);
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(function (request) {
      if (request) {
        console.log('Responding with cache : ' + e.request.url);
        return request
      } else {
        console.log('File is not cached, fetching : ' + e.request.url);
        return fetch(e.request)
      }
    })
  )
})

self.addEventListener('install', async function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async function (cache) {
      console.log('Installing cache : ' + CACHE_NAME);
      return cache.addAll(URLS)
    })
  )
})

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key, i) {
        console.log('Deleting cache : ' + keyList[i]);
        return caches.delete(keyList[i])
      }))
    })
  )
})