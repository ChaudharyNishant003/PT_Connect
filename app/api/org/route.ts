import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireTeacher, requireOwner } from "@/lib/auth/guards";
import { updateOrgSchema } from "@/lib/validation/org";
import { toErrorResponse } from "@/lib/api/errors";

export async function GET() {
  try {
    const session = await requireTeacher();

    const organization = await prisma.organization.findUniqueOrThrow({ where: { id: session.orgId } });

    const teachers =
      session.role === "OWNER"
        ? await prisma.teacher.findMany({
            where: { orgId: session.orgId },
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
            orderBy: { createdAt: "asc" },
          })
        : undefined;

    return NextResponse.json({ organization, teachers });
  } catch (error) {
    return toErrorResponse(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireOwner();
    const body = updateOrgSchema.parse(await request.json());

    const organization = await prisma.organization.update({
      where: { id: session.orgId },
      data: body,
    });

    return NextResponse.json({ organization });
  } catch (error) {
    return toErrorResponse(error);
  }
}
