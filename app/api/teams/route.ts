import { NextResponse } from "next/server";
import zod from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const teamSchema = zod.object({
  name: zod.string().min(1, "Team name is required"),
  description: zod.string().optional(),
});

export async function GET() {
  try {
    const teams = await prisma.team.findMany();
    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Failed to fetch teams" },
      { status: 500 },
    );
  }
}

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
