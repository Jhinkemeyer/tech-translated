import { Resend } from "resend";
import { NextResponse } from "next/server";

// This pulls your secret key from the .env.local file
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Read the data sent from the frontend form
    const { name, email, message } = await request.json();

    // Tell Resend to dispatch the email
    const data = await resend.emails.send({
      from: "Tech Translated <onboarding@resend.dev>", // Resend's default testing address
      to: ["joshuahinkemeyer@gmail.com"], // Sending it directly to your inbox
      subject: `New Dispatch via Tech Translated from ${name}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
