const VERSION = 'v2';

self.addEventListener('install', (event) => {
  console.log('Service worker - install', VERSION);

  // self.skipWaiting(); // 제어중인 서비스워커가 존재해도 건너뜀
});

self.addEventListener('activate', (event) => {
  console.log('Service worker - activate', VERSION);

  // self.clients.claim(); // 활성화 즉시 클라이언트 제어
});

self.addEventListener('fetch', (event) => {
  console.log('Service worker - fetch', event.request.url);

  // .jpg 확장자 파일을 요청할 경우 모두 강아지 사진으로 대체
  if (event.request.url.endsWith('.jpg')) {
    console.log('멍멍');
    event.respondWith(fetch('/upload/puppy.jpg'));
  }
});
