import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYUeeDS3B7--K79GZ6CXyo72Zl2aVWChQ",
  authDomain: "tech-translated-55e1d.firebaseapp.com",
  projectId: "tech-translated-55e1d",
  storageBucket: "tech-translated-55e1d.firebasestorage.app",
  messagingSenderId: "400088323989",
  appId: "1:400088323989:web:01951f8d99f2a0a89fc89c",
  measurementId: "G-M2E59F6JQG",
};

// Initialize Firebase (this prevents Next.js from trying to initialize it twice during local reloads)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
