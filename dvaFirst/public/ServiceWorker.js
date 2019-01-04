const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.js'
];
self.addEventListener('install', function(event) {
  // Perform install steps
  console.log(event);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});
self.addEventListener('fetch', function(event) {
    event.respondWith(
      // 以下方法检视请求，并从服务工作线程所创建的任何缓存中查找缓存的结果。
      caches.match(event.request)
        .then(function(response) {
          // 如果发现匹配的响应，则返回缓存的值
          console.log(response);
          if (response) {
            return response;
          }
          return fetch(event.request); 
        }
      ).catch(err=>{a
          console.log(err);
          return "error"
      })
    );
});
self.addEventListener("message",(data)=>{
    console.log(data);
});