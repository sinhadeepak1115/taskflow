import { NextResponse } from "next/server";
import zod from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const teamSchema = zod.object({
  name: zod.string().min(1, "Team name is required"),
  description: zod.string().optional(),
});

export async function GET() {}

export async function POST(req: Request) {
  const parsedTeam = teamSchema.safeParse(await req.json());
  if (!parsedTeam.success) {
    return NextResponse.json(
      { errors: parsedTeam.error.issues },
      { status: 400 },
    );
  }
  try {
    const task = await prisma.team.create({
      data: parsedTeam.data,
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
  }
}
