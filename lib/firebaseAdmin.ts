import * as admin from "firebase-admin";

export function getAdminApp() {
  if (!admin.apps.length) {
    // Only attempt to initialize if we have the variables
    if (!process.env.FIREBASE_PROJECT_ID) {
      console.warn(
        "Firebase Admin variables not found. Skipping initialization during build.",
      );
      return null;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }

  return {
    adminDb: admin.firestore(),
    adminMessaging: admin.messaging(),
  };
}
