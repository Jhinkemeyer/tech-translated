import { NextResponse } from "next/server";
import { adminDb, adminMessaging } from "../../../lib/firebaseAdmin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, summary, url } = body;

    // 1. Grab every single device token from your pushSubscribers collection
    const snapshot = await adminDb.collection("pushSubscribers").get();
    const tokens = snapshot.docs.map((doc) => doc.data().token);

    if (tokens.length === 0) {
      return NextResponse.json({ message: "No active subscribers to notify." });
    }

    // 2. Build the notification payload
    const payload = {
      notification: {
        title: title,
        body: summary,
      },
      webpush: {
        fcmOptions: {
          // When they click the notification, it opens your new article!
          link: url,
        },
      },
      tokens: tokens,
    };

    // 3. Blast it out to all devices simultaneously
    const response = await adminMessaging.sendEachForMulticast(payload);

    return NextResponse.json({
      success: true,
      sentCount: response.successCount,
      failedCount: response.failureCount,
    });
  } catch (error) {
    console.error("Error sending transmission:", error);
    return NextResponse.json(
      { error: "Failed to broadcast signal" },
      { status: 500 },
    );
  }
}
