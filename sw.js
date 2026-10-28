/* Citas app: shows a normal iPhone notification whenever the shop server sends a push. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) {}
  e.waitUntil(self.registration.showNotification(d.title || 'New appointment request', {
    body: d.body || 'Tap to review it.',
    icon: 'icon-192.png',
    badge: 'icon-192.png',
    tag: d.tag || undefined,
    data: { url: d.url || 'admin.html' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || 'admin.html', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(async list => {
    for (const c of list) {
      if (c.url.startsWith(self.registration.scope)) { try { await c.navigate(url); } catch (_) {} return c.focus(); }
    }
    return self.clients.openWindow(url);
  }));
});
