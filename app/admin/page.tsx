"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Clear any old errors

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // If successful, send them to the dashboard
      router.push("/admin/dashboard");
    } catch (err) {
      setError("Invalid email or password. Access Denied.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 border border-zinc-800 rounded-xl bg-zinc-900/30">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Access</h1>

      {/* This box only shows up if there is an error */}
      {error && (
        <div className="bg-red-950/50 border border-red-900 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-zinc-50 text-zinc-950 font-bold px-8 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Authenticate
        </button>
      </form>
    </div>
  );
}
