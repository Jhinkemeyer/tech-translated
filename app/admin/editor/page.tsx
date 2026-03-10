"use client";

import { useState, useEffect } from "react";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "../../../components/RichTextEditor";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

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
      // 1. Save to Firebase
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        summary,
        content,
        createdAt: serverTimestamp(),
      });

      // 2. Fetch the subscribers directly from the secure frontend
      const querySnapshot = await getDocs(collection(db, "subscribers"));
      const emails = querySnapshot.docs.map((doc) => doc.data().email);

      // 3. Trigger the email transmission, passing the emails along!
      const response = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          summary,
          postId: docRef.id,
          emails, // Added the emails array here!
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Transmission Error Data:", errorData);
        alert(`Article saved, but emails failed: ${errorData.error}`);
      }

      // 4. Send them back to the dashboard
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error publishing document: ", error);
      alert("Failed to publish. Check console for details.");
    } finally {
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
          <RichTextEditor content={content} onChange={setContent} />
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
