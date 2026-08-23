import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import { createStudentSchema } from "@/lib/validation/students";
import { toErrorResponse } from "@/lib/api/errors";

export async function GET(request: NextRequest) {
  try {
    const session = await requireTeacher();
    const includeArchived = request.nextUrl.searchParams.get("archived") === "true";

    const students = await prisma.student.findMany({
      where: scopeWhere(session, includeArchived ? {} : { isArchived: false }),
      include: { subjects: { orderBy: { sortOrder: "asc" } }, teacher: { select: { name: true } } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ students });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireTeacher();
    const body = createStudentSchema.parse(await request.json());

    const student = await prisma.student.create({
      data: {
        orgId: session.orgId,
        teacherId: session.sub,
        name: body.name,
        grade: body.grade,
        parentName: body.parentName,
        parentPhone: body.parentPhone,
        subjects: {
          create: body.subjects.map((name, index) => ({ name, sortOrder: index })),
        },
      },
      include: { subjects: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json({ student }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
