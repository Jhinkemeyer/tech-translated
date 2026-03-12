"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import Link from "next/link";
import SubscribeBox from "../components/SubscribeBox";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, "posts"),
          orderBy("createdAt", "desc"),
          limit(5),
        );
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
          Complex tech, translated. Practical advice and insights for your
          digital life.
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
          posts.map((post, index) => (
            <Link
              href={`/post/${post.id}`}
              key={post.id}
              className={`items-center justify-between gap-6 p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors cursor-pointer group ${
                index >= 3 ? "hidden sm:flex" : "flex"
              }`}
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-zinc-300 transition-colors">
                  {post.title}
                </h2>

                {/* NEW: Wrapped Date and Tags in a flex row so they sit nicely together */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <p className="text-zinc-500 text-sm">
                    {post.createdAt?.toDate
                      ? post.createdAt.toDate().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Just now"}
                  </p>

                  {/* NEW: The Tag Pills Rendering Block */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string, tagIndex: number) => (
                        <span
                          key={tagIndex}
                          className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-zinc-300 line-clamp-2">{post.summary}</p>
              </div>

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

      {!loading && posts.length > 0 && (
        <div className="flex justify-center pt-4 pb-8">
          <Link
            href="/archive"
            className="text-emerald-500 hover:text-emerald-400 font-semibold transition-colors"
          >
            View All Transmissions &rarr;
          </Link>
        </div>
      )}

      <SubscribeBox />
    </div>
  );
}
