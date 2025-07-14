import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";
import { getServerSession } from "next-auth";
import { generateToken } from "@/lib/token";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email, teamId, senderId } = await req.json();
    if (!email || !teamId || !senderId) {
      return NextResponse.json(
        { error: "Email, teamId, and senderId are required" },
        { status: 400 },
      );
    }
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.invitation.create({
      data: {
        email,
        token,
        teamId,
        senderId,
        expiresAt,
      },
    });
    const invitationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/teams/invite?token=${token}`;

    await sendMail({
      to: email,
      subject: "You are invited to join a team",
      text: `You have been invited to join a team. Click the link below to accept the invitation:\n\n${invitationLink}\n\nThis invitation will expire in 24 hours.`,
    });
    return NextResponse.json(
      { message: "Invitation sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 },
    );
  }
}
