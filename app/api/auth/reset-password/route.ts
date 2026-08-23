import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { resetPasswordSchema } from "@/lib/validation/auth";
import { toErrorResponse } from "@/lib/api/errors";

export async function POST(request: NextRequest) {
  try {
    const body = resetPasswordSchema.parse(await request.json());

    const resetToken = await prisma.passwordResetToken.findUnique({ where: { token: body.token } });
    if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "This reset link is no longer valid" }, { status: 400 });
    }

    const passwordHash = await hashPassword(body.password);

    await prisma.$transaction([
      prisma.teacher.update({ where: { id: resetToken.teacherId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    ]);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return toErrorResponse(error);
  }
}
