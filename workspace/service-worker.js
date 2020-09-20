const VERSION = 'v5';
const CACHE_NAME = 'paper-cache_' + VERSION;
const IMAGE_CACHE_NAME = 'paper-image_' + VERSION;

const IMMUTABLE_APPSHELL = [
  '/favicon.ico',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/manifest.json',
  '/images/no_image.png',
  '/images/add_photo.svg',
  '/images/clear.svg',
  '/images/delete.svg',
  '/images/favorite_active.svg',
  '/images/favorite.svg',
  '/images/menu.svg',
  '/images/notification.svg',
  '/images/notification_disabled.svg',
  '/images/notification_enabled.svg'
];

const MUTABLE_APPSHELL = [
  '/',
  '/login',
  '/js/app.js',
  '/js/util.js',
  '/js/common.js',
  '/js/axios.min.js',
  '/js/index.js',
  '/js/login.js',
  '/js/paper-store.js',
  '/css/index.css',
  '/css/login.css'
];

const CACHE_LIST = IMMUTABLE_APPSHELL.concat(MUTABLE_APPSHELL);
const DYNAMIC_PATTERN = /(\.eot$|\.ttf$|\.woff$|^\/icons)/;

self.addEventListener('install', (event) => {
  console.log('Service worker - install', VERSION);

  // self.skipWaiting(); // 제어중인 서비스워커가 존재해도 건너뜀

  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_LIST);
    })
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service worker - activate', VERSION);

  // self.clients.claim(); // 활성화 즉시 클라이언트 제어
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // 캐시 이름이 CACHE_NAME 이 아닌 경우 삭제
          if (key !== CACHE_NAME && key !== IMAGE_CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('Service worker - fetch', event.request.url);

  // .jpg 확장자 파일을 요청할 경우 모두 강아지 사진으로 대체
  // if (event.request.url.endsWith('.jpg')) {
  //   console.log('멍멍');
  //   event.respondWith(fetch('/upload/puppy.jpg'));
  // }

  // event.respondWith(
  //   caches.match(event.request).then((response) => {
  //     return response || fetch(event.request);
  //   })
  // );

  const url = new URL(event.request.url);

  // 자주 변경되지 않는 리소소의 경우
  if (IMMUTABLE_APPSHELL.includes(url.pathname)) {
    // 선캐시, 후 네트워크
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  } else if (MUTABLE_APPSHELL.includes(url.pathname)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch(() => {
            return cache.match(event.request);
          });
      })
    );
  } else if (
    url.pathname.startsWith('/upload') ||
    DYNAMIC_PATTERN.test(url.pathname)
  ) {
    const TARGET_CACHE = url.pathname.startsWith('/upload')
      ? IMAGE_CACHE_NAME
      : CACHE_NAME;

    event.respondWith(
      caches.open(TARGET_CACHE).then((cache) => {
        return cache.match(event.request).then((cacheResponse) => {
          if (cacheResponse) {
            return cacheResponse;
          } else {
            return fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
        });
      })
    );
  }
});
