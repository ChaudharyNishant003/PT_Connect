import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth/guards";
import { toErrorResponse } from "@/lib/api/errors";

const patchSchema = z.object({ isActive: z.boolean() });

export async function PATCH(request: NextRequest, { params }: { params: { teacherId: string } }) {
  try {
    const session = await requireOwner();
    const body = patchSchema.parse(await request.json());

    const teacher = await prisma.teacher.findFirst({
      where: { id: params.teacherId, orgId: session.orgId },
    });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const updated = await prisma.teacher.update({
      where: { id: teacher.id },
      data: { isActive: body.isActive },
    });

    return NextResponse.json({ teacher: updated });
  } catch (error) {
    return toErrorResponse(error);
  }
}
