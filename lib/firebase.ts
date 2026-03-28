import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAYUeeDS3B7--K79GZ6CXyo72Zl2aVWChQ",
  authDomain: "tech-translated-55e1d.firebaseapp.com",
  projectId: "tech-translated-55e1d",
  storageBucket: "tech-translated-55e1d.firebasestorage.app",
  messagingSenderId: "400088323989",
  appId: "1:400088323989:web:01951f8d99f2a0a89fc89c",
  measurementId: "G-M2E59F6JQG",
};

// Initialize Firebase (prevents Next.js from initializing twice)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// NEW: A bulletproof helper function to safely load messaging in Next.js
export const getMessagingInstance = async () => {
  if (typeof window === "undefined") return null; // Abort if on the server

  try {
    const { getMessaging, isSupported } = await import("firebase/messaging");
    const supported = await isSupported();

    if (supported) {
      return getMessaging(app);
    }
    return null;
  } catch (error) {
    console.error("Firebase messaging not supported:", error);
    return null;
  }
};

export { app, auth, db, storage };
