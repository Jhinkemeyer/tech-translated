"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // This checks if you have the secret Firebase keycard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // No keycard? Kick them back to the login page!
        router.push("/admin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/");
  };

  // Show a quick loading state while it checks the keycard
  if (!user)
    return (
      <div className="text-center mt-20 text-zinc-500 font-mono">
        Verifying credentials...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold">Admin Command Center</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-950/50 text-red-200 px-4 py-2 rounded hover:bg-red-900/50 transition-colors text-sm font-medium"
        >
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* We will wire this up to a real text editor soon */}
        <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30">
          <h2 className="text-xl font-semibold mb-2">Write a Dispatch</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Draft a new post and publish it directly to the Tech Translated
            feed.
          </p>
          <Link
            href="/admin/editor"
            className="block text-center bg-zinc-50 text-zinc-950 font-bold px-6 py-2 rounded-lg hover:bg-zinc-200 transition-colors w-full"
          >
            Open Editor
          </Link>
        </div>

        <div className="p-6 border border-zinc-800 rounded-xl bg-zinc-900/30">
          <h2 className="text-xl font-semibold mb-4">System Status</h2>
          <div className="space-y-2 text-sm">
            <p className="text-zinc-400">
              Database Connection:{" "}
              <span className="text-emerald-400 font-medium ml-2">Secure</span>
            </p>
            <p className="text-zinc-400">
              Authenticated as:{" "}
              <span className="text-zinc-300 ml-2">{user.email}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
