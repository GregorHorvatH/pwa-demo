// registration --> installation --> activation
// fetch

const staticCacheName = 'static-cache-v0';
const dynamicCacheName = 'dynamic-cache-v0';

const staticAssets = [
  './',
  './index.html',
  './offline.html',
  './images/no-image.jpg',
  './images/icon/apple-icon-180x180-dunplab-manifest-13620.png',
  './images/icon/favicon-96x96-dunplab-manifest-13620.png',
  './css/style.css',
  './js/registerWorker.js',
  './js/main.js',
];

self.addEventListener('install', async (event) => {
  const cache = await caches.open(staticCacheName);
  await cache.addAll(staticAssets);

  console.log('Service workar has been installed:');
});

self.addEventListener('activate', async (event) => {
  const cachesKeys = await caches.keys();

  const checkKeys = cachesKeys.map(async (key) => {
    if (staticCacheName !== key) {
      await caches.delete(key);
    }
  });

  await Promise.all(checkKeys);

  console.log('Service workar has been activated:');
});

self.addEventListener('fetch', async (event) => {
  console.log('Trying to fetch:', event.request.url);

  // event.respondWith(
  //   caches.match(event.request).then((cachedResponse) => {
  //     return cachedResponse || fetch(event.request);
  //   }),
  // );

  event.respondWith(checkCache(event.request));
});

async function checkCache(req) {
  const cachedResponse = await caches.match(req);

  return cachedResponse || checkOnline(req);
}

async function checkOnline(req) {
  const cache = await caches.open(dynamicCacheName);

  try {
    const res = await fetch(req);
    await cache.put(req, res.clone());

    return res;
  } catch (error) {
    // return await cache.match(req);

    const cachedRes = await cache.match(req);

    if (cachedRes) {
      return cachedRes;
    } else if (req.url.includes('.html')) {
      return caches.match('./offline.html');
    } else {
      return caches.match('./images/no-image.jpg');
    }
  }
}
