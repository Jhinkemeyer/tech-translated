"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Post() {
  const params = useParams();
  const id = params.id as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const docRef = doc(db, "posts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching dispatch:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading)
    return (
      <div className="max-w-3xl mx-auto mt-12 px-6 text-zinc-500 font-mono animate-pulse">
        Decrypting dispatch...
      </div>
    );
  if (!post)
    return (
      <div className="max-w-3xl mx-auto mt-12 px-6 text-zinc-500 font-mono">
        Dispatch not found. The signal was lost.
      </div>
    );

  return (
    <article className="max-w-3xl mx-auto mt-8 px-6">
      <Link
        href="/"
        className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium mb-12 inline-block"
      >
        ← Back to Feed
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
        {post.title}
      </h1>

      <p className="text-zinc-400 text-sm mb-12 border-b border-zinc-800 pb-8">
        Published on{" "}
        {post.createdAt?.toDate
          ? post.createdAt.toDate().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "Just now"}
      </p>

      {/* whitespace-pre-wrap ensures the line breaks from your text box are respected */}
      <div className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}
