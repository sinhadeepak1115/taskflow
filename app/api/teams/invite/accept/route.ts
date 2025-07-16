import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const session = await getServerSession(authOptions);
  if (!token || !session?.user?.email) {
    return NextResponse.json(
      { message: "You are not logged in" },
      { status: 401 },
    );
  }

  try{
    const invitation = await prisma.invitation.findUnique({
     where: {token: token || "" },
    })
    if (!invitation || invitation.expiresAt < new Date()) {
      return NextResponse.json(
        { message: "Invalid or expired invitation token" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    
    if (!user){
      return NextResponse.json({error: "User not found"}, {status: 404});
    }

    await prisma.teamMember.upsert({
      where:{
        userId_teamId: {
          userId: user.id,
          teamId: invitation.teamId,
        },
      },
      update: {},
      create:{
        userId: user.id,
        teamId: invitation.teamId,
        role:  "MEMBER",
    },
    });
    await prisma.invitation.delete({
    where: { token  },
    })
    return NextResponse.json({message: "Invitation accepted successfully!"});
  }catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json({error: "Failed to accept invitation"}, {status: 500});
  }
}
