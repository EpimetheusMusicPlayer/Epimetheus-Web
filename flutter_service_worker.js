'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "b8d11ffe590dc7c0229b291cb11e1aff",
"main.dart.js": "fc036a1f310084d90f05e04b09c4aa52",
"assets/NOTICES": "b24e9d390815639fcf367925f2295905",
"assets/FontManifest.json": "9d68dba7bd4b3308c8b59fec74b6fafe",
"assets/packages/outline_material_icons/lib/outline_material_icons.ttf": "6b94994fffd9868330d830fcb18a6026",
"assets/fonts/MaterialIcons-Regular.otf": "a68d2a28c526b3b070aefca4bac93d25",
"assets/assets/app_icon.png": "cc759121c11e4945c85b6ce9f3668109",
"assets/assets/fast_forward.flr": "491aa3e75bd3c33dc705c498fe4a653a",
"assets/assets/music_note.png": "3f2e26a7a956a1d54339197937d4ae04",
"assets/assets/skip.flr": "73e80230dc8d0b86b6da3c71fff15831",
"assets/assets/thumbprint.svg": "d3668de5c31f211c889c01855a1ac66b",
"assets/assets/media_playing.flr": "6dfe144d037e2b8fd44139416451f727",
"assets/AssetManifest.json": "a0bc5ab923c9e078400597575de7b1ad",
"index.html": "df81b79e16d36d13cd30604967f618c2",
"/": "df81b79e16d36d13cd30604967f618c2",
"favicon.ico": "e6706bc905db99558a89dda74b666b0c",
"manifest.json": "e6434088c6aaf21d70159a25322081e1",
"browserconfig.xml": "e13f0b361bdd3e968aaab50a8e9ab734",
"icons/android-icon-96x96.png": "094739004a824e662108408d1c613fa4",
"icons/apple-icon-120x120.png": "b3078e9420a64df70811439f281e7144",
"icons/android-icon-144x144.png": "ad2f0f57f6693780a3d961b147125578",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/favicon-32x32.png": "3ffc52e0018f75829d148ceda054a74b",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/ms-icon-70x70.png": "6027b84a52ac971573ba022b37e49682",
"icons/apple-icon-60x60.png": "7529055a4912fc85110d7219f72a4c85",
"icons/apple-icon-76x76.png": "a089ced80b31ee80bfddb5586f2ead39",
"icons/android-icon-72x72.png": "4cf8015250d01e1b59da2b3e4f4ba7b8",
"icons/apple-icon-72x72.png": "4cf8015250d01e1b59da2b3e4f4ba7b8",
"icons/ms-icon-150x150.png": "91c53b4d2376d69b1662a1bfe1c46612",
"icons/favicon-96x96.png": "094739004a824e662108408d1c613fa4",
"icons/apple-icon-180x180.png": "579a7f126e9f84a53496e10f9b151718",
"icons/ms-icon-310x310.png": "17821fd4faca533661f2d8bacb61e284",
"icons/apple-icon-144x144.png": "ad2f0f57f6693780a3d961b147125578",
"icons/apple-icon-114x114.png": "cdd5f082ba9962677a2488a8b66e36d8",
"icons/android-icon-192x192.png": "0e22de6481609b0603e43e0061145780",
"icons/favicon.ico": "e6706bc905db99558a89dda74b666b0c",
"icons/favicon-16x16.png": "21bd8953d52d4cb8ab187ad6c0de590d",
"icons/apple-icon-57x57.png": "1b141e16551cc862edc05f070878eb2a",
"icons/android-icon-36x36.png": "7952ff742dae8111bceda3d1947d8259",
"icons/ms-icon-144x144.png": "ad2f0f57f6693780a3d961b147125578",
"icons/android-icon-48x48.png": "b02a4850c7faccdf4143014a4d830f86",
"icons/apple-icon.png": "69825c9239c1c52b292e17f2843e62d5",
"icons/apple-icon-152x152.png": "06fab36706d121fd3a5d80501e525b8d",
"icons/apple-icon-precomposed.png": "69825c9239c1c52b292e17f2843e62d5"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
