"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";

export default function Archive() {
  const [posts, setPosts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        // Querying the database with NO limit so we get the entire history
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching archive:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  // The Live Search Filter Logic
  const filteredPosts = posts.filter((post) => {
    const titleMatch = post.title
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const summaryMatch = post.summary
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return titleMatch || summaryMatch;
  });

  return (
    <div className="space-y-8">
      <section className="mb-8 border-b border-zinc-800 pb-8">
        <h1 className="text-4xl font-bold mb-4">The Archive</h1>
        <p className="text-zinc-400 text-lg mb-8">
          Every transmission, project, and guide. Search the database below.
        </p>

        {/* The Live Search Bar */}
        <div className="relative max-w-2xl">
          <input
            type="text"
            placeholder="Search dispatches..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-zinc-50 focus:outline-none focus:border-zinc-600 transition-colors"
          />
          <div className="absolute right-4 top-3.5 text-zinc-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        {loading ? (
          <p className="text-zinc-500 font-mono animate-pulse">
            Accessing the mainframe...
          </p>
        ) : filteredPosts.length === 0 ? (
          <p className="text-zinc-500 py-8 text-center border border-dashed border-zinc-800 rounded-xl">
            No transmissions found matching "{searchQuery}".
          </p>
        ) : (
          filteredPosts.map((post) => (
            <Link
              href={`/post/${post.id}`}
              key={post.id}
              className="flex items-center justify-between p-4 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/30 transition-colors group"
            >
              <div>
                <h2 className="text-lg font-semibold group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-zinc-500 text-sm">
                  {post.createdAt?.toDate
                    ? post.createdAt.toDate().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Archived"}
                </p>
              </div>
              <div className="text-zinc-600 group-hover:text-emerald-500 transition-colors">
                &rarr;
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
