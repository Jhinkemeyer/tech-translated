"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Protect the room just like the dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin");
    });
    return () => unsubscribe();
  }, [router]);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save the dispatch to the Firestore database
      await addDoc(collection(db, "posts"), {
        title,
        summary,
        content,
        createdAt: serverTimestamp(), // Firebase automatically stamps the exact time
      });

      // Send you back to the dashboard once it's saved
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error publishing document: ", error);
      alert("Failed to publish. Check console for details.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 px-6">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold">Write Dispatch</h1>
        <Link
          href="/admin/dashboard"
          className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm font-medium"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handlePublish} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors text-xl font-bold"
            placeholder="e.g. Optimizing the Slicer-Deck Workflow"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Quick Summary
          </label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors"
            placeholder="A short teaser for the homepage feed..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Main Content
          </label>
          <textarea
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors font-mono text-sm leading-relaxed"
            placeholder="Start writing your dispatch..."
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-500 text-emerald-950 font-bold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish Dispatch"}
          </button>
        </div>
      </form>
    </div>
  );
}
