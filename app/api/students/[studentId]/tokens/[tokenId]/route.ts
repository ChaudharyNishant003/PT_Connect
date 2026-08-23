import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireTeacher } from "@/lib/auth/guards";
import { scopeWhere } from "@/lib/db/scope";
import { generateParentToken } from "@/lib/auth/tokens";
import { toErrorResponse } from "@/lib/api/errors";

const patchSchema = z.object({ action: z.enum(["regenerate", "revoke"]) });

export async function PATCH(
  request: NextRequest,
  { params }: { params: { studentId: string; tokenId: string } },
) {
  try {
    const session = await requireTeacher();
    const body = patchSchema.parse(await request.json());

    const student = await prisma.student.findFirst({ where: scopeWhere(session, { id: params.studentId }) });
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const existing = await prisma.parentAccessToken.findFirst({
      where: { id: params.tokenId, studentId: student.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    if (body.action === "revoke") {
      const token = await prisma.parentAccessToken.update({
        where: { id: existing.id },
        data: { isActive: false, revokedAt: new Date() },
      });
      return NextResponse.json({ token });
    }

    const [, newToken] = await prisma.$transaction([
      prisma.parentAccessToken.update({
        where: { id: existing.id },
        data: { isActive: false, revokedAt: new Date() },
      }),
      prisma.parentAccessToken.create({
        data: { studentId: student.id, token: generateParentToken(), label: existing.label },
      }),
    ]);

    return NextResponse.json({ token: newToken });
  } catch (error) {
    return toErrorResponse(error);
  }
}
