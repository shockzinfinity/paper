self.addEventListener('install', (event) => {
  console.log('Service worker - install');
});

self.addEventListener('activate', (event) => {
  console.log('Service worker - activate');
});

self.addEventListener('fetch', (event) => {
  console.log('Service worker - fetch', event.request.url);
});
