const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  console.log(event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', function(event) {
    console.log(event);
    event.respondWith(
      // 以下方法检视请求，并从服务工作线程所创建的任何缓存中查找缓存的结果。
      caches.match(event.request)
        .then(function(response) {
          console.log(event.request)
          console.log(caches)
          // 如果发现匹配的响应，则返回缓存的值
          if (response) {
            return response;
          }
          return fetch(event.request);
        }
      ).catch(err=>{
          console.log(err);
      })
    );
});
self.addEventListener("message",(data)=>{
    console.log(data);
});