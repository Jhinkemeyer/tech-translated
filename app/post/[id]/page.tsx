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

  // State to control the desktop copy-to-clipboard notification
  const [showToast, setShowToast] = useState(false);

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

  // The Share Logic Function
  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: "Check out this post on Tech Translated!",
          url: url,
        });
      } catch (error) {
        console.error("Error sharing the post:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShowToast(true);
        // Hide the toast after 3 seconds
        setTimeout(() => setShowToast(false), 3000);
      } catch (error) {
        console.error("Failed to copy the link:", error);
      }
    }
  };

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
    <article className="max-w-3xl mx-auto mt-8 px-6 relative">
      <Link
        href="/"
        className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium mb-12 inline-block"
      >
        &larr; Back to Feed
      </Link>

      <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
        {post.title}
      </h1>

      {/* Flex container to hold metadata on the left and share button on the right */}
      <div className="mb-12 border-b border-zinc-800 pb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        {/* Left Side: Date and Tags */}
        <div>
          <p className="text-zinc-400 text-sm">
            Published on{" "}
            {post.createdAt?.toDate
              ? post.createdAt.toDate().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Just now"}
          </p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300 border border-zinc-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: The Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors text-sm font-medium border border-zinc-700 shadow-sm shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
          Share
        </button>
      </div>

      {/* whitespace-pre-wrap ensures the line breaks from your text box are respected */}
      {/* dangerouslySetInnerHTML is React's way of executing the HTML string your editor created */}
      <div
        className="prose prose-invert max-w-none text-zinc-300 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* The Floating Desktop Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-zinc-800 text-zinc-200 px-5 py-3 rounded-lg shadow-2xl border border-zinc-700 flex items-center gap-3 z-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-medium">Link copied to clipboard!</span>
        </div>
      )}
    </article>
  );
}
