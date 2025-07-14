import { NextRequest, NextResponse } from "next/server";
import zod from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const taskSchema = zod.object({
  title: zod.string().min(1, "Title is required"),
  description: zod.string().optional(),
  status: zod.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: zod.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: zod.coerce.date().optional(),
});

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({});
    return new Response(JSON.stringify(tasks));
  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
}

export async function POST(req: NextRequest) {
  const parsedTask = taskSchema.safeParse(await req.json());
  if (!parsedTask.success) {
    return NextResponse.json(
      { errors: parsedTask.error.issues },
      { status: 400 },
    );
  }
  try {
    const task = await prisma.task.create({
      data: parsedTask.data,
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
  }
  const parsedTask = taskSchema.safeParse(await req.json());
  if (!parsedTask.success) {
    return NextResponse.json(
      { errors: parsedTask.error.issues },
      { status: 400 },
    );
  }
  try {
    const task = await prisma.task.update({
      where: { id },
      data: parsedTask.data,
    });

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
  }
}
