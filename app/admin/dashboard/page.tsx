"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/admin");
      } else {
        setUser(currentUser);
        fetchPosts();
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetches all your published dispatches from Firebase
  const fetchPosts = async () => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const fetchedPosts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPosts(fetchedPosts);
  };

  // The Deletion Protocol
  const handleDelete = async (id: string) => {
    // Adds a safety check so you don't accidentally click it!
    if (
      window.confirm(
        "Are you sure you want to permanently delete this dispatch? This cannot be undone.",
      )
    ) {
      try {
        await deleteDoc(doc(db, "posts", id));
        // Instantly removes it from your screen without needing a page refresh
        setPosts(posts.filter((post) => post.id !== id));
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Failed to delete dispatch. Check the console.");
      }
    }
  };

  if (!user)
    return <div className="p-8 text-zinc-500 font-mono">Authenticating...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-6 space-y-12">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold">Admin Command Center</h1>
        <button
          onClick={() => signOut(auth)}
          className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium border border-red-900/50 bg-red-950/20 px-4 py-2 rounded-lg"
        >
          Sign Out
        </button>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30">
          <h2 className="text-xl font-bold mb-2">Write a Dispatch</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Draft a new post and publish it directly to the feed.
          </p>
          <Link
            href="/admin/editor"
            className="block w-full text-center bg-zinc-50 text-zinc-950 font-bold px-4 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            Open Editor
          </Link>
        </div>

        <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 flex flex-col justify-center">
          <h2 className="text-xl font-bold mb-2">System Status</h2>
          <div className="space-y-2 text-sm text-zinc-400">
            <p>
              Database Connection:{" "}
              <span className="text-emerald-400">Secure</span>
            </p>
            <p>
              Authenticated as:{" "}
              <span className="text-zinc-50">{user?.email}</span>
            </p>
          </div>
        </div>
      </div>

      {/* The New Management Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6 border-b border-zinc-800 pb-2">
          Manage Dispatches
        </h2>
        {posts.length === 0 ? (
          <p className="text-zinc-500 italic">No dispatches found.</p>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-zinc-800 bg-zinc-900/20"
              >
                <div className="mb-4 sm:mb-0">
                  <h3 className="font-bold text-lg text-zinc-50">
                    {post.title}
                  </h3>
                  <p className="text-sm text-zinc-500 font-mono mt-1">
                    {post.createdAt?.toDate
                      ? post.createdAt.toDate().toLocaleDateString()
                      : "Just now"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 sm:flex-nowrap">
                  <Link
                    href={`/post/${post.id}`}
                    target="_blank"
                    className="px-4 py-2 rounded-md text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 transition-colors text-center"
                  >
                    View
                  </Link>

                  {/* NEW: The Edit Button */}
                  <Link
                    href={`/admin/edit/${post.id}`}
                    className="px-4 py-2 rounded-md text-sm font-medium text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 hover:bg-emerald-900/50 hover:text-emerald-300 transition-colors text-center"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-4 py-2 rounded-md text-sm font-medium text-red-400 bg-red-950/30 border border-red-900/50 hover:bg-red-900/50 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
