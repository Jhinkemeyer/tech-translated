import * as admin from "firebase-admin";

// Check if the admin app is already running so we don't initialize it twice
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // The replace function ensures the Next.js server reads the newline characters correctly
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const adminDb = admin.firestore();
const adminMessaging = admin.messaging();

export { adminDb, adminMessaging };
