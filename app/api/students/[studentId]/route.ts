import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import { updateStudentSchema } from "@/lib/validation/students";
import { toErrorResponse } from "@/lib/api/errors";

export async function GET(_request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const session = await requireTeacher();
    const student = await prisma.student.findFirst({
      where: scopeWhere(session, { id: params.studentId }),
      include: {
        subjects: { orderBy: { sortOrder: "asc" } },
        parentAccessTokens: { where: { isActive: true } },
      },
    });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ student });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const session = await requireTeacher();
    const body = updateStudentSchema.parse(await request.json());

    const existing = await prisma.student.findFirst({
      where: scopeWhere(session, { id: params.studentId }),
    });
    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student = await prisma.student.update({
      where: { id: existing.id },
      data: {
        ...body,
        archivedAt: body.isArchived === undefined ? undefined : body.isArchived ? new Date() : null,
      },
      include: { subjects: { orderBy: { sortOrder: "asc" } } },
    });

    return NextResponse.json({ student });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const session = await requireTeacher();
    const existing = await prisma.student.findFirst({
      where: scopeWhere(session, { id: params.studentId }),
    });
    if (!existing) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const student = await prisma.student.update({
      where: { id: existing.id },
      data: { isArchived: true, archivedAt: new Date() },
    });

    return NextResponse.json({ student });
  } catch (error) {
    return toErrorResponse(error);
  }
}
