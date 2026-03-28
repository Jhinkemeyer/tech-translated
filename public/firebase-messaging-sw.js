// We have to import Firebase via standard CDN scripts for the Service Worker
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.1/firebase-messaging-compat.js",
);

// Initialize the Firebase app in the service worker using your exact config
firebase.initializeApp({
  apiKey: "AIzaSyAYUeeDS3B7--K79GZ6CXyo72Zl2aVWChQ",
  authDomain: "tech-translated-55e1d.firebaseapp.com",
  projectId: "tech-translated-55e1d",
  storageBucket: "tech-translated-55e1d.firebasestorage.app",
  messagingSenderId: "400088323989",
  appId: "1:400088323989:web:01951f8d99f2a0a89fc89c",
});

// Retrieve an instance of Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo-clear.png", // Uses your clear logo from the public folder!
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
