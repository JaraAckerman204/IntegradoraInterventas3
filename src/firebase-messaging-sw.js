importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyB_XyXkGjbBD63DTU_Hfc9RlErYiz79TQI",
  authDomain: "integradorainterventas.firebaseapp.com",
  projectId: "integradorainterventas",
  storageBucket: "integradorainterventas.appspot.com",
  messagingSenderId: "710007139235",
  appId: "1:710007139235:web:08ff0194124097f7b64816"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en segundo plano:', payload);

  const notificationTitle = payload.notification?.title || 'Nueva notificación';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/assets/icon/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
