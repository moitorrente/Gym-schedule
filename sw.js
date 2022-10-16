

const GHPATH = '/Gym-schedule';
const APP_PREFIX = 'Gym_schedule_';
const VERSION = 'version_009o';

const URLS = [    
    `${GHPATH}/`,
    `${GHPATH}/icon.png`,
    `${GHPATH}/index.html`,
    `${GHPATH}/html/add-exercise.html`,
    `${GHPATH}/html/log-exercise.html`,
    `${GHPATH}/js/script.js`,
    `${GHPATH}/js/log.js`,
    `${GHPATH}/js/add.js`,
    `${GHPATH}/css/style.css`,
    `${GHPATH}/css/calendar.css`,
    `${GHPATH}/html/historic.html`,
    `${GHPATH}/js/historic.js`,
    `${GHPATH}/js/calendar.js`,
    `${GHPATH}/js/data.js`,
    `${GHPATH}/css/loader.css`,
    `${GHPATH}/data/exercises.json`

  ]

  var CACHE_NAME = APP_PREFIX + VERSION
  self.addEventListener('fetch', function (e) {
    console.log('Fetch request : ' + e.request.url);
    e.respondWith(
      caches.match(e.request).then(function (request) {
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
            console.log('Deleting cache : ' + keyList[i] );
            return caches.delete(keyList[i])
          }
        }))
      })
    )
  })