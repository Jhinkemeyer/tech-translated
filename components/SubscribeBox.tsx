"use client";

import { useState, useEffect } from "react";
import { db, getMessagingInstance } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getToken } from "firebase/messaging";

export default function SubscribeBox() {
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [pushStatus, setPushStatus] = useState<
    "idle" | "loading" | "success" | "error" | "denied" | "unsupported"
  >("idle");

  // Check if the browser actually supports push notifications on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!("Notification" in window)) {
        setPushStatus("unsupported");
      } else if (Notification.permission === "denied") {
        setPushStatus("denied");
      }
    }
  }, []);

  const handleEmailSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setEmailStatus("loading");
    try {
      await addDoc(collection(db, "subscribers"), {
        email: email,
        subscribedAt: serverTimestamp(),
      });
      setEmailStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Error adding email subscriber: ", error);
      setEmailStatus("error");
    }
  };

  const handlePushSubscribe = async () => {
    setPushStatus("loading");
    try {
      const messaging = await getMessagingInstance();
      if (!messaging) {
        setPushStatus("unsupported");
        return;
      }

      // This triggers the native browser "Allow Notifications" prompt
      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        setPushStatus("denied");
        return;
      }

      // Grab the secure token using your VAPID key
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (token) {
        // Save the device token to a new collection
        await addDoc(collection(db, "pushSubscribers"), {
          token: token,
          subscribedAt: serverTimestamp(),
        });
        setPushStatus("success");
      } else {
        setPushStatus("error");
      }
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      setPushStatus("error");
    }
  };

  return (
    <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-8 max-w-2xl mx-auto my-12 text-center">
      <h3 className="text-2xl font-bold text-zinc-50 mb-2">
        Join the Transmission
      </h3>
      <p className="text-zinc-400 mb-8">
        Choose how you want to receive updates. No spam, just tech.
      </p>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Email Section */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
            Via Email
          </h4>
          {emailStatus === "success" ? (
            <div className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 px-4 py-3 rounded-lg font-medium text-sm h-full flex items-center justify-center">
              Signal received! You're on the list.
            </div>
          ) : (
            <form
              onSubmit={handleEmailSubscribe}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <button
                type="submit"
                disabled={emailStatus === "loading"}
                className="w-full bg-zinc-50 text-zinc-950 font-bold px-6 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {emailStatus === "loading"
                  ? "Connecting..."
                  : "Subscribe via Email"}
              </button>
            </form>
          )}
        </div>

        {/* Push Notification Section */}
        <div className="flex flex-col gap-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-500">
            Via Browser
          </h4>

          {pushStatus === "success" ? (
            <div className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 px-4 py-3 rounded-lg font-medium text-sm h-full flex items-center justify-center">
              Notifications active for this device!
            </div>
          ) : pushStatus === "denied" ? (
            <div className="bg-red-950/30 border border-red-900/50 text-red-400 px-4 py-3 rounded-lg font-medium text-sm h-full flex items-center justify-center">
              Notifications blocked by browser settings.
            </div>
          ) : pushStatus === "unsupported" ? (
            <div className="bg-zinc-800/50 border border-zinc-700 text-zinc-400 px-4 py-3 rounded-lg font-medium text-sm h-full flex items-center justify-center">
              Your browser does not support push notifications.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePushSubscribe}
                disabled={pushStatus === "loading"}
                className="w-full bg-zinc-800 text-zinc-50 font-bold px-6 py-2 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-emerald-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                {pushStatus === "loading"
                  ? "Requesting..."
                  : "Enable Browser Alerts"}
              </button>
              <p className="text-xs text-zinc-500 leading-relaxed text-left">
                Securely powered by Firebase. Opt-out anytime in your browser
                settings. No personal data required.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
