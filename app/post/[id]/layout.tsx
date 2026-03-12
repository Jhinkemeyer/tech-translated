import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { Metadata } from "next";

// This runs on the server to build the perfect preview card before the page even loads
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const id = params.id;

  try {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const post = docSnap.data();
      return {
        title: `${post.title} | Tech Translated`,
        description: post.summary,
        openGraph: {
          title: post.title,
          description: post.summary,
          // This tells Facebook, Twitter, and iMessage which image to show!
          images: post.coverImage ? [post.coverImage] : [],
        },
      };
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  // Fallback metadata just in case a link is broken
  return {
    title: "Tech Translated",
    description: "Signal, no noise. Making everyday technology work for you.",
  };
}

export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
