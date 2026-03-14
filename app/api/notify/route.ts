import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { title, summary, postId, emails } = await req.json();

    if (!emails || emails.length === 0) {
      return NextResponse.json({ message: "No subscribers found." });
    }

    const postUrl = `https://techtranslated.dev/post/${postId}`;

    // 1. Chunk the emails into groups of 100
    const CHUNK_SIZE = 100;
    const emailChunks = [];
    for (let i = 0; i < emails.length; i += CHUNK_SIZE) {
      emailChunks.push(emails.slice(i, i + CHUNK_SIZE));
    }

    // 2. Loop through chunks and send individual batch payloads
    for (const chunk of emailChunks) {
      const batchPayload = chunk.map((email: string) => ({
        from: "Tech Translated <joshua@techtranslated.dev>",
        to: [email], // CRITICAL: This bracket makes it a personal email, not a group thread
        subject: `New Dispatch: ${title}`,
        html: `
          <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #10b981;">New Dispatch from Tech Translated</h2>
            <h3>${title}</h3>
            <p style="font-size: 16px; line-height: 1.5;">${summary}</p>
            <a href="${postUrl}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Read the full article</a>
          </div>
        `,
      }));

      // Send the batch request to Resend
      const { error } = await resend.batch.send(batchPayload);

      if (error) {
        console.error("Batch error inside loop:", error);
        // We continue the loop so one bad chunk doesn't kill the whole process
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Transmission error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 },
    );
  }
}
