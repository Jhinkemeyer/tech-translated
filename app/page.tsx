"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import SubscribeBox from "../components/SubscribeBox";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Query the database for the "posts" collection, ordered by newest first
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="space-y-8">
      <section className="mb-12 border-b border-zinc-800 pb-8">
        <h1 className="text-4xl font-bold mb-4">Latest Dispatches</h1>
        <p className="text-zinc-400 text-lg">
          Breaking down the coolest hardware, PC builds, and software.
        </p>
      </section>

      <div className="grid gap-6">
        {loading ? (
          <p className="text-zinc-500 font-mono animate-pulse">
            Fetching dispatches from the cloud...
          </p>
        ) : posts.length === 0 ? (
          <p className="text-zinc-500">
            No dispatches found. The feed is quiet.
          </p>
        ) : (
          posts.map((post) => (
            <Link
              href={`/post/${post.id}`}
              key={post.id}
              // NEW: Added 'flex', 'justify-between', and 'group' to the main card
              className="flex items-center justify-between gap-6 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors cursor-pointer group"
            >
              {/* NEW: Wrapped the text in a flex-1 container so it takes up the left side */}
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-zinc-300 transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-400 text-sm mb-4">
                  {post.createdAt?.toDate
                    ? post.createdAt.toDate().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Just now"}
                </p>
                <p className="text-zinc-300 line-clamp-2">{post.summary}</p>
              </div>

              {/* NEW: The Thumbnail Container! Hidden on mobile (hidden), shown on desktop (sm:block) */}
              {post.coverImage && (
                <div className="hidden sm:block w-40 h-28 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-800">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
            </Link>
          ))
        )}
      </div>
      {/* The new Subscribe Box goes right here! */}
      <SubscribeBox />
    </div>
  );
}
