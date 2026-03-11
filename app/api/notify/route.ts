import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Notice we added 'emails' to the incoming payload!
    const { title, summary, postId, emails } = await req.json();

    if (!emails || emails.length === 0) {
      return NextResponse.json({ message: "No subscribers found." });
    }

    const postUrl = `https://techtranslated.dev/post/${postId}`;

    const { data, error } = await resend.emails.send({
      from: "Tech Translated <joshua@techtranslated.dev>",
      to: emails,
      subject: `New Dispatch: ${title}`,
      html: `
        <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">New Dispatch from Tech Translated</h2>
          <h3>${title}</h3>
          <p style="font-size: 16px; line-height: 1.5;">${summary}</p>
          <a href="${postUrl}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #10b981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Read the full article</a>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Transmission error:", error);
    return NextResponse.json(
      { error: "Failed to send emails" },
      { status: 500 },
    );
  }
}
