"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function SubscribeBox() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      // Adds the email to a new 'subscribers' collection in your database
      await addDoc(collection(db, "subscribers"), {
        email: email,
        subscribedAt: serverTimestamp(),
      });
      setStatus("success");
      setEmail("");
    } catch (error) {
      console.error("Error adding subscriber: ", error);
      setStatus("error");
    }
  };

  return (
    <div className="border border-zinc-800 bg-zinc-900/30 rounded-xl p-8 max-w-2xl mx-auto my-12 text-center">
      <h3 className="text-2xl font-bold text-zinc-50 mb-2">
        Join the Transmission
      </h3>
      <p className="text-zinc-400 mb-6">
        Get notified whenever I publish a new dispatch, drop a new project, or
        share hardware advice. No spam, just tech.
      </p>

      {status === "success" ? (
        <div className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 px-4 py-3 rounded-lg font-medium">
          Signal received! You're officially on the list.
        </div>
      ) : (
        <form
          onSubmit={handleSubscribe}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
            required
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2 text-zinc-50 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-zinc-50 text-zinc-950 font-bold px-6 py-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Connecting..." : "Subscribe"}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="text-red-400 text-sm mt-3">
          Connection failed. Please try again.
        </p>
      )}
    </div>
  );
}
