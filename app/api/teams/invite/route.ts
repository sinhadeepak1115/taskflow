import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { to, subject, text } = body;
  try {
    await sendMail({
      to,
      subject,
      text,
    });
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
