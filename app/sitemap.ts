import { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.techtranslated.dev";

  // 1. Fetch all your transmissions from the database
  const querySnapshot = await getDocs(collection(db, "posts"));
  const posts = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  // 2. Format them for Google's crawlers
  const postUrls = posts.map((post: any) => ({
    url: `${baseUrl}/post/${post.id}`,
    lastModified: post.createdAt?.toDate ? post.createdAt.toDate() : new Date(),
  }));

  // 3. Map your static navigation pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/bio`,
      lastModified: new Date(),
    },
  ];

  // 4. Combine them all into one master map
  return [...staticPages, ...postUrls];
}
