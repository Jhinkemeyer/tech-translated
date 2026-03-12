"use client";

import { useState, useEffect } from "react";
import { auth, db, storage } from "../../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "../../../../components/RichTextEditor";

export default function EditPost() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  // NEW: State to hold our comma-separated tags
  const [tags, setTags] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin");
      } else {
        fetchPostData();
      }
    });
    return () => unsubscribe();
  }, [router, postId]);

  const fetchPostData = async () => {
    try {
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setTitle(data.title || "");
        setSummary(data.summary || "");
        setContent(data.content || "");
        setCoverImage(data.coverImage || "");
        // NEW: If tags exist in the database (as an array), convert them back into a comma-separated string for the text box
        if (data.tags && Array.isArray(data.tags)) {
          setTags(data.tags.join(", "));
        }
      } else {
        alert("Dispatch not found!");
        router.push("/admin/dashboard");
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const docRef = doc(db, "posts", postId);

      // NEW: Convert the comma-separated string back into a clean array before saving
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // SURGICAL UPDATE: Now passing the tagsArray
      await updateDoc(docRef, {
        title,
        summary,
        tags: tagsArray,
        content,
        coverImage,
      });

      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Failed to update. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-zinc-500 font-mono animate-pulse">
          Accessing database records...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-6">
      <div className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold">Edit Dispatch</h1>
        <Link
          href="/admin/dashboard"
          className="text-zinc-400 hover:text-zinc-50 transition-colors text-sm font-medium"
        >
          Cancel
        </Link>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors text-xl font-bold"
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
            required
          />
        </div>

        {/* NEW: Tags Input Field for the Editor */}
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

        <div className="flex justify-end pt-4 pb-12">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-500 text-emerald-950 font-bold px-8 py-3 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Updating Database..." : "Update Dispatch"}
          </button>
        </div>
      </form>
    </div>
  );
}
