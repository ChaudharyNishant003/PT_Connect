import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import { updateSubjectSchema } from "@/lib/validation/students";
import { toErrorResponse } from "@/lib/api/errors";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { studentId: string; subjectId: string } },
) {
  try {
    const session = await requireTeacher();
    const body = updateSubjectSchema.parse(await request.json());

    const student = await prisma.student.findFirst({ where: scopeWhere(session, { id: params.studentId }) });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const subject = await prisma.subject.update({
      where: { id: params.subjectId, studentId: student.id },
      data: body,
    });

    return NextResponse.json({ subject });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { studentId: string; subjectId: string } },
) {
  try {
    const session = await requireTeacher();

    const student = await prisma.student.findFirst({ where: scopeWhere(session, { id: params.studentId }) });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    await prisma.subject.delete({ where: { id: params.subjectId, studentId: student.id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
