import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import { createSubjectSchema, reorderSubjectsSchema } from "@/lib/validation/students";
import { toErrorResponse } from "@/lib/api/errors";

async function findOwnedStudent(session: Awaited<ReturnType<typeof requireTeacher>>, studentId: string) {
  return prisma.student.findFirst({ where: scopeWhere(session, { id: studentId }) });
}

export async function POST(request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const session = await requireTeacher();
    const body = createSubjectSchema.parse(await request.json());

    const student = await findOwnedStudent(session, params.studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const count = await prisma.subject.count({ where: { studentId: student.id } });

    const subject = await prisma.subject.create({
      data: { studentId: student.id, name: body.name, color: body.color, sortOrder: count },
    });

    return NextResponse.json({ subject }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const session = await requireTeacher();
    const body = reorderSubjectsSchema.parse(await request.json());

    const student = await findOwnedStudent(session, params.studentId);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await prisma.$transaction(
      body.order.map((subjectId, index) =>
        prisma.subject.update({
          where: { id: subjectId, studentId: student.id },
          data: { sortOrder: index },
        }),
      ),
    );

    const subjects = await prisma.subject.findMany({
      where: { studentId: student.id },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ subjects });
  } catch (error) {
    return toErrorResponse(error);
  }
}
