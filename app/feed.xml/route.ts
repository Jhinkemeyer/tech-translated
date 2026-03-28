import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../../lib/firebase"; // Adjust this path if your lib folder is somewhere else!

export async function GET() {
  // 1. Fetch the 10 most recent dispatches from Firestore
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    limit(10),
  );
  const querySnapshot = await getDocs(q);

  // 2. Define your base URL
  const site_url = "https://www.techtranslated.dev";

  let itemsXml = "";

  // 3. Loop through the posts and format them for RSS
  querySnapshot.forEach((doc) => {
    const post = doc.data();
    const postDate = post.createdAt?.toDate() || new Date();

    itemsXml += `
      <item>
        <title><![CDATA[${post.title}]]></title>
        <link>${site_url}/post/${doc.id}</link>
        <guid>${site_url}/post/${doc.id}</guid>
        <pubDate>${postDate.toUTCString()}</pubDate>
        <description><![CDATA[${post.summary || ""}]]></description>
      </item>
    `;
  });

  // 4. Wrap the items in the standard RSS channel formatting
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Tech Translated</title>
      <link>${site_url}</link>
      <description>Complex tech, translated. Practical advice and insights for your digital life.</description>
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      ${itemsXml}
    </channel>
  </rss>`;

  // 5. Return the XML with the correct headers so browsers recognize it as an RSS feed
  return new Response(rss, {
    headers: {
      "Content-Type": "text/xml",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  });
}
