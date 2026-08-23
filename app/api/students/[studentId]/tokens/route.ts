import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import { generateParentToken } from "@/lib/auth/tokens";
import { createTokenSchema } from "@/lib/validation/tokens";
import { toErrorResponse } from "@/lib/api/errors";

export async function GET(_request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const session = await requireTeacher();
    const student = await prisma.student.findFirst({ where: scopeWhere(session, { id: params.studentId }) });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const tokens = await prisma.parentAccessToken.findMany({
      where: { studentId: student.id, isActive: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function POST(request: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const session = await requireTeacher();
    const body = createTokenSchema.parse(await request.json());

    const student = await prisma.student.findFirst({ where: scopeWhere(session, { id: params.studentId }) });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const token = await prisma.parentAccessToken.create({
      data: { studentId: student.id, token: generateParentToken(), label: body.label },
    });

    return NextResponse.json({ token }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
