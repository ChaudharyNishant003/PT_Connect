import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { acceptInviteSchema } from "@/lib/validation/auth";
import { toErrorResponse } from "@/lib/api/errors";

export async function POST(request: NextRequest) {
  try {
    const body = acceptInviteSchema.parse(await request.json());

    const invite = await prisma.inviteToken.findUnique({
      where: { token: body.token },
      include: { teacher: true },
    });

    if (!invite || invite.usedAt || invite.expiresAt < new Date()) {
      return NextResponse.json({ error: "This invite link is no longer valid" }, { status: 400 });
    }

    const passwordHash = await hashPassword(body.password);

    await prisma.$transaction([
      prisma.teacher.update({ where: { id: invite.teacherId }, data: { passwordHash } }),
      prisma.inviteToken.update({ where: { id: invite.id }, data: { usedAt: new Date() } }),
    ]);

    await setSessionCookie({
      sub: invite.teacher.id,
      orgId: invite.teacher.orgId,
      role: invite.teacher.role,
      name: invite.teacher.name,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
