import zod from "zod";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

const taskSchema = zod.object({
  title: zod.string().min(1, "Title is required"),
  description: zod.string().optional(),
  status: zod.enum(["TODO", "IN_PROGRESS", "DONE"]).default("TODO"),
  priority: zod.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  dueDate: zod.coerce.date().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    const task = await prisma.task.findUnique({
      where: { id: id },
    });
    if (!task) {
      return new NextResponse(JSON.stringify({ error: "Task not found" }), {
        status: 404,
      });
    }
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error fetching task:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      },
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const parsedTask = taskSchema.safeParse(await req.json());
  if (!parsedTask.success) {
    return NextResponse.json(
      { errors: parsedTask.error.issues },
      { status: 400 },
    );
  }
  try {
    const task = prisma.task.update({
      where: { id },
      data: parsedTask.data,
    });
    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("Error updateing the task", error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  try {
    await prisma.task.delete({
      where: { id },
    });
    return new NextResponse(JSON.stringify({ message: "Task deleted" }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      },
    );
  }
}
