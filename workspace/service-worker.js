self.addEventListener('install', (event) => {
  console.log('Service worker - install');
});

self.addEventListener('activate', (event) => {
  console.log('Service worker - activate');
});

self.addEventListener('fetch', (event) => {
  console.log('Service worker - fetch', event.request.url);

  // .jpg 확장자 파일을 요청할 경우 모두 강아지 사진으로 대체
  if (event.request.url.endsWith('.jpg')) {
    console.log('멍멍');
    event.respondWith(fetch('/upload/puppy.jpg'));
  }
});
