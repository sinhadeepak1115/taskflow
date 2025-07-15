import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
//FIX: PrismaClient is not defined
export async function GET(req: NextRequest) {
  console.log("GET request to /api/teams/join");
  const token = req.nextUrl.searchParams.get("token");
  console.log(token);
  return NextResponse.json(
    { message: "Join team endpoint hit", token },
    { status: 200 },
  );
}
