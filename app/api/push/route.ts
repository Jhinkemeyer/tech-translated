import { NextResponse } from "next/server";
import { getAdminApp } from "../../../lib/firebaseAdmin";

// This tells Next.js NOT to try and prerender this route during the build
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const adminApp = getAdminApp();

    // If the app didn't initialize (like during a build), just return early
    if (!adminApp) {
      return NextResponse.json(
        { error: "Admin SDK not initialized" },
        { status: 500 },
      );
    }

    const { adminDb, adminMessaging } = adminApp;
    const body = await request.json();
    const { title, summary, url } = body;

    const snapshot = await adminDb.collection("pushSubscribers").get();
    const tokens = snapshot.docs.map((doc) => doc.data().token);

    if (tokens.length === 0) {
      return NextResponse.json({ message: "No active subscribers." });
    }

    const payload = {
      notification: { title, body: summary },
      webpush: { fcmOptions: { link: url } },
      tokens: tokens,
    };

    const response = await adminMessaging.sendEachForMulticast(payload);

    return NextResponse.json({
      success: true,
      sentCount: response.successCount,
    });
  } catch (error) {
    console.error("Push error:", error);
    return NextResponse.json({ error: "Broadcast failed" }, { status: 500 });
  }
}
