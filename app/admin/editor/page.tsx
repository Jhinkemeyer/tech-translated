"use client";

import { useState, useEffect } from "react";
import { auth, db, storage } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "../../../components/RichTextEditor";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: State for the Push Notification Toggle
  const [sendPush, setSendPush] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin");
    });
    return () => unsubscribe();
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const storageRef = ref(storage, `covers/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setCoverImage(downloadURL);
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Failed to upload cover image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // 1. Save to Firebase
      const docRef = await addDoc(collection(db, "posts"), {
        title,
        summary,
        tags: tagsArray,
        content,
        coverImage,
        createdAt: serverTimestamp(),
      });

      // 2. Fetch the subscribers directly from the secure frontend
      const querySnapshot = await getDocs(collection(db, "subscribers"));
      const emails = querySnapshot.docs.map((doc) => doc.data().email);

      // 3. Trigger the email transmission
      const emailResponse = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          summary,
          postId: docRef.id,
          emails,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error("Email Transmission Error Data:", errorData);
        alert(`Article saved, but emails failed: ${errorData.error}`);
      }

      // NEW: 4. Trigger the Push Notification if the toggle is checked
      if (sendPush) {
        // Automatically grabs localhost:3000 for local testing, or your real domain in production
        const postUrl = `${window.location.origin}/post/${docRef.id}`;

        const pushResponse = await fetch("/api/push", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            summary,
            url: postUrl,
          }),
        });

        if (!pushResponse.ok) {
          console.error("Push Notification Failed");
          alert("Article saved, but push notifications failed to send.");
        }
      }

      // 5. Send them back to the dashboard
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
            Categories & Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors text-sm"
            placeholder="e.g. Linux, Hardware, Streaming (separate with commas)"
          />
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-lg">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Cover Image (Desktop Feed Thumbnail)
          </label>
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploadingImage}
              className="text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-zinc-800 file:text-zinc-300 hover:file:bg-zinc-700 transition-colors cursor-pointer"
            />
            {isUploadingImage && (
              <span className="text-emerald-500 text-sm animate-pulse">
                Uploading...
              </span>
            )}
          </div>

          {coverImage && (
            <div className="mt-4 relative h-48 w-full sm:w-80 rounded-lg overflow-hidden border border-zinc-700">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="object-cover w-full h-full"
              />
              <button
                type="button"
                onClick={() => setCoverImage("")}
                className="absolute top-2 right-2 bg-red-500/90 text-white px-3 py-1 rounded text-xs font-bold hover:bg-red-500 transition-colors shadow-lg"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Main Content
          </label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        {/* NEW: Updated Publish Bar with Toggle */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 pb-12 border-t border-zinc-800 mt-8">
          <div className="flex items-center gap-3 bg-zinc-900/50 px-5 py-3 rounded-lg border border-zinc-800 w-full sm:w-auto">
            <input
              type="checkbox"
              id="pushToggle"
              checked={sendPush}
              onChange={(e) => setSendPush(e.target.checked)}
              className="w-5 h-5 accent-emerald-500 cursor-pointer bg-zinc-900 border-zinc-700 rounded"
            />
            <label
              htmlFor="pushToggle"
              className="text-sm font-bold text-zinc-300 cursor-pointer select-none"
            >
              Blast Browser Push Notification
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-emerald-500 text-emerald-950 font-bold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Publishing..." : "Publish Dispatch"}
          </button>
        </div>
      </form>
    </div>
  );
}
